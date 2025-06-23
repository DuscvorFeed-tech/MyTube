using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using MyTube.Core.Domain.FileFfs;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Domain.Video;
using MyTube.Core.Domain.Video.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.CommonType;
using MyTube.Services.FileFfsService;
using MyTube.Services.Helpers.File;
using MyTube.Services.Helpers.Filter;
using MyTube.Services.Helpers.Filter.Artist;
using MyTube.Services.Helpers.Filter.Video;
using MyTube.Services.Helpers.Ipfs;
using MyTube.Services.Helpers.Key;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.Helpers.Token;
using MyTube.Services.Helpers.Url;
using MyTube.Services.SysSettings;

namespace MyTube.Services.Video
{
    public class VideoService : IVideoService
    {

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly AppSettings _appSettings;
        private readonly VideoSettings_v2 _videoSettings;
        private readonly FfsIntegrationSettings _ffsIntegrationSettings;
        private readonly ICommonTypeService _commonTypeService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ImageSettings_v2 _imageSettings;
        private readonly IFileFfsService _fileFfsService;
        private readonly PaypalSettings_v2 _paypalSettings;
        private readonly IpfsSettings_v2 _ipfsSettings;
        private static IVideoService videoServiceStatic;

        public VideoService(DataContext dataContext, IWeRaveYouLog logger,
                            IOptions<AppSettings> appSettings, 
                            IOptions<FfsIntegrationSettings> ffsIntegrationSettings,
                            ICommonTypeService commonTypeService,
                            IHttpContextAccessor contextAccessor,
                            IFileFfsService fileFfsService, ISysSettingsService sysSettingsService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _appSettings = appSettings.Value;
            _ffsIntegrationSettings = ffsIntegrationSettings.Value;
            _commonTypeService = commonTypeService;
            _contextAccessor = contextAccessor;
            _fileFfsService = fileFfsService;
            videoServiceStatic = this;

            var settings = sysSettingsService.GetSysSettingsList();
            _paypalSettings = SysSettingsHelper.GetPaypalSettings(settings, _logger);
            _ipfsSettings = SysSettingsHelper.GetIPFSSettings(settings, _logger);
            _imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);
            _videoSettings = SysSettingsHelper.GetVideoSettings(settings, _logger);

        }

        public async Task<BaseResponse> GetVideoListAsync()
        {
            BaseResponse response = null;

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {

                List<Core.Domain.Video.Video> videos = null;
                List<Core.Domain.CommonType.CommonType> videoTypes = null;

                try
                {
                    videos = await _dataContext.Videos.AsNoTracking()
                                    .Include(e => e.User)
                                    .Include(e => e.Thumbnail)
                                    .Where(p =>
                                                p.UserId == user.Id)
                                    .ToListAsync();

                    videoTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.VideoType);

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from video table: {ex}");
                    _logger.Debug($"WHERE UserId={user.Id}");
                }

                if (videos != null)
                {

                    var records = videos.Select(p => new
                    {
                        p.Title,
                        p.Description,
                        Category = GetVideoType(videoTypes, p.VideoType, false),
                        CategoryEn = GetVideoType(videoTypes, p.VideoType, true),
                        p.Hash,
                        VideoUrl = string.Format(_videoSettings.ServerUrl, p.Hash),
                        VideoThumbnailUrl = GetVideoThumbnailUrl(_imageSettings.ServerUrl, p.Thumbnail),
                        p.User.Username,
                        Duration = GetVideoDuration(p.Duration),
                        PostedSince = GetVideoPostedSince(p.DateCreated),
                        VideoViewCount = GetVideoViewCount(p.Views),
                        DatePosted = Convert.ToDateTime(p.DateCreated).ToString("MMM dd, yyyy"),
                        p.DateCreated
                    });

                    response = new SuccessResponse(records);

                }
                else
                {
                    response = new SuccessResponse();
                }

            }
            else
            {
                _logger.Debug($"Cannot get user information from HttpContext: {_contextAccessor}");
                response = new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
            }

            return response;
        }

        #region GetVideoListAsync

        public async Task<object> GetVideoListAsync(VideoFilter filter)
        {

            List<Core.Domain.Video.Video> videos = null;
            List<Core.Domain.CommonType.CommonType> videoTypes = null;

            try
            {

                SetDefaultIfSetValuesAreNotValid(filter);

                videos = await _dataContext.Videos.AsNoTracking()
                                    .Include(e => e.User)
                                        .ThenInclude(e => e.SubscriptionSettings)
                                    .Include(e => e.Views)
                                    .Include(e => e.Thumbnail)
                                    .ToListAsync();

                videoTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.VideoType);


            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from video table: {ex}");
                _logger.Debug($"WHERE");
            }

            if (videos != null)
            {
                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];

                videos = FilterRecords(filter, videos);

                var records = videos.Select(p => new FRONT_RecommendedPayPerViewList
                {
                    Title = p.Title,
                    Description = p.Description,
                    Category = GetVideoType(videoTypes, p.VideoType, false),
                    CategoryEn = GetVideoType(videoTypes, p.VideoType, true),
                    Hash = p.PaidContent == true ? p.PaidContentHash : p.Hash,
                    VideoThumbnailUrl = GetVideoThumbnailUrl(_imageSettings.ServerUrl, p.Thumbnail),
                    Username = p.User.Username,
                    UserProfilePictureUrl = p.User.ProfilePictureHash.HasValue() == true ?
                                    string.Format(_imageSettings.ServerUrl, p.User.ProfilePictureHash)
                                    : "",
                    Duration = GetVideoDuration(p.Duration),
                    PostedSince = GetVideoPostedSince(p.DateCreated),
                    VideoViewCount = GetVideoViewCount(p.Views),
                    DatePosted = Convert.ToDateTime(p.DateCreated).ToString("MMM dd, yyyy"),
                    PaidContent = p.PaidContent,
                    PaidContentPrice = string.Format("{0}{1}", _paypalSettings.Currency, p.PaidContentPrice?.ToString("N", CultureInfo.InvariantCulture)),
                    PaidContentFilPrice = p.PaidContentFilPrice,
                    DateCreated = p.DateCreated,
                    Purchased = CheckIfUserAlreadyPurchasedPayperView(user?.Id, p.Id),
                    Subscribed = CheckIfUserAlreadySubscribedToArtist(user?.Id, p.UserId)
                });

                records = records.Where(p => p.Purchased == false);

                RecordListResponse response = null;

                response = new RecordListResponse(records.Count(), filter.RecordPerPage);

                if (response.Total > 0)
                {
                    records = records.Skip((filter.CurrentPage - 1) * filter.RecordPerPage)
                            .Take(filter.RecordPerPage);
                }

                response.Filter = filter;
                response.Data.AddRange(records);

                return response;

            }
            else
            {
                return null;
            }

        }

        private bool CheckIfUserAlreadySubscribedToArtist(long? userId, long artistId)
        {
            if (userId.HasValue == false)
            {
                return false;
            }

            try
            {

                var purchasedSubscription = _dataContext.Purchases.AsNoTracking()
                                    .Include(e => e.SubscriptionSettings)
                                    .Where(p =>
                                                p.UserId == userId &&
                                                p.PurchaseType == PurchaseType.Subscription &&
                                                (
                                                    p.PurchaseStatusType == PurchaseStatusType.WaitingForPayment ||
                                                    p.PurchaseStatusType == PurchaseStatusType.Active
                                                ) &&
                                                p.Active == true &&
                                                p.SubscriptionSettings.UserId == artistId)
                                    .FirstOrDefault();

                if(purchasedSubscription != null)
                {
                    return true;
                }
                
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={userId} AND PurchaseType={(int)PurchaseType.Subscription} AND " +
                    $"PurchaseStatusType={(int)PurchaseStatusType.WaitingForPayment} OR PurchaseStatusType={(int)PurchaseStatusType.Active}" +
                    $"AND Active=1 AND subscription_settings.UserId={artistId} ");
            }

            return false;

        }

        private bool CheckIfUserAlreadyPurchasedPayperView(long? userId, long videoId)
        {
            if (userId.HasValue == false)
            {
                return false;
            }

            try
            {

                return _dataContext.Purchases.AsNoTracking()
                        .Where(p =>
                                    p.UserId == userId &&
                                    p.VideoId == videoId &&
                                    p.PurchaseType == PurchaseType.PayPerView &&
                                    (
                                        p.PurchaseStatusType == PurchaseStatusType.Captured ||
                                        p.PurchaseStatusType == PurchaseStatusType.CouponCodeSent ||
                                        p.PurchaseStatusType == PurchaseStatusType.Active
                                    )
                            )
                        .Count() > 0;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={userId} AND VideoId={videoId} AND PurchaseType={(int)PurchaseType.PayPerView} AND " +
                    $"PurchaseStatusType={(int)PurchaseStatusType.Captured} OR PurchaseStatusType={(int)PurchaseStatusType.CouponCodeSent} OR PurchaseStatusType={(int)PurchaseStatusType.Active}");
            }

            return false;

        }

        public static string GetVideoType(List<Core.Domain.CommonType.CommonType> videoTypes, VideoType videoType, bool englishName)
        {
            string response = "";

            if (videoTypes != null && videoTypes.LongCount() > 0)
            {

                var vidType = videoTypes.Where(p => p.Value == (int)videoType).SingleOrDefault();
                if (vidType != null)
                {
                    response = englishName == false ? vidType.Name : vidType.NameEn;
                }

            }

            return response;
        }

        private void SetDefaultIfSetValuesAreNotValid(FilterHelper filter)
        {
            if (filter.RecordPerPage <= 0)
            {
                filter.RecordPerPage = _appSettings.RecordPerPage;
            }
            else if (filter.RecordPerPage > _appSettings.MaxRecordPerPage)
            {
                filter.RecordPerPage = _appSettings.MaxRecordPerPage;
            }

            if (filter.CurrentPage < 1)
            {
                filter.CurrentPage = 1;
            }
        }


        public static string GetVideoThumbnailUrl(string imageServerUrl, VideoThumbnail thumbnail)
        {
            if (thumbnail != null)
            {

                return string.Format(imageServerUrl, thumbnail.Thumbnail);

            }

            return null;

        }

        private List<Core.Domain.Video.Video> FilterRecords(VideoFilter filter, List<Core.Domain.Video.Video> videos)
        {
            //  Check if keyword is specified
            if (filter.Keyword.HasValue())
            {

                if (filter.FilterType == Helpers.Filter.Video.FilterType.PayPerView)
                {
                    //  Search videos by keyword
                    videos = videos.Where(p =>
                                                p.Title.ToLower().Contains(filter.Keyword.ToLower()) ||
                                                p.User.Username.ToLower().Contains(filter.Keyword.ToLower()))
                                    .ToList();
                }
                else
                {
                    //  Search videos by keyword
                    videos = videos.Where(p =>
                                                (p.Title + " " + p.Description + " " +
                                                p.Hash).ToLower().Contains(filter.Keyword.ToLower()))
                                    .ToList();
                }
            }


            if (filter.VideoType != null)
            {

                videos = videos.Where(p =>
                                            p.VideoType == filter.VideoType)
                                .ToList();

            }

            
            if (filter.FilterType == Helpers.Filter.Video.FilterType.New)
            {
                videos = videos.OrderByDescending(p => p.DateCreated).ToList();
            }
            else if(filter.FilterType == Helpers.Filter.Video.FilterType.PayPerView)
            {
                videos = videos.Where(p =>
                                            p.PaidContent == true &&
                                            p.PaidContentHash != null)
                                .ToList();
            }

            videos = OrderRecords(filter, videos);

            return videos;

        }

        private List<Core.Domain.Video.Video> OrderRecords(VideoFilter filter, List<Core.Domain.Video.Video> videos)
        {
            if (filter.FilterType != Helpers.Filter.Video.FilterType.New)
            {
                if (filter.OrderBy != null && filter.OrderType != null)
                {
                    if (filter.OrderType == Helpers.Filter.OrderType.Ascending)
                    {
                        if (filter.OrderBy == VideoOrderByType.DateCreated)
                        {
                            videos = videos.OrderBy(p => p.DateCreated).ToList();
                        }
                    }
                    else
                    {
                        if (filter.OrderBy == VideoOrderByType.DateCreated)
                        {
                            videos = videos.OrderByDescending(p => p.DateCreated).ToList();
                        }
                    }
                }
                else if (filter.OrderType != null && filter.OrderBy == null)
                {
                    if (filter.OrderType == Helpers.Filter.OrderType.Ascending)
                    {
                        videos = videos.OrderBy(p => p.Id).ToList();
                    }
                    else
                    {
                        videos = videos.OrderByDescending(p => p.Id).ToList();
                    }
                }
            }

            return videos;
        }

        public static string GetVideoDuration(TimeSpan duration)
        {
            string value = "";
            if (duration.Hours == 0)
            {
                value = duration.ToString(@"mm\:ss");
            }
            else
            {
                value = duration.ToString(@"h\:mm\:ss");

            }

            return value;
        }

        private static string GetVideoPostedSince(DateTime? dateCreated)
        {
            var dateToday = DateTime.Now;

            TimeSpan interval = dateToday - (DateTime)dateCreated;

            var totalHours = Math.Round(interval.TotalHours);
            var totalDays = Math.Round(interval.TotalDays);
            var totalMonths = Math.Round((totalDays / 30));
            var totalYear = Math.Round((totalDays / 365));

            if (totalYear <= 0 && totalDays == 0 && interval.Hours == 0 && interval.Minutes == 0)
            {
                if (interval.Seconds == 0)
                {
                    return "Just now";
                }

                return string.Format("{0} seconds ago", interval.Seconds);
            }
            else if (totalYear <= 0 && totalDays == 0 && interval.Hours == 0 && interval.Minutes > 0)
            {
                if (interval.Minutes == 1)
                {
                    return string.Format("{0} minute ago", interval.Minutes);
                }

                return string.Format("{0} minutes ago", interval.Minutes);
            }
            else if (totalYear <= 0 && totalDays == 0 && interval.Hours > 0 && interval.Hours < 24)
            {
                if (totalHours == 1)
                {
                    return string.Format("{0} hour ago", interval.Hours);
                }

                return string.Format("{0} hours ago", totalHours);
            }
            else if (totalYear <= 0 && totalDays > 0 && totalDays < 7)
            {
                if (totalDays == 1)
                {
                    return string.Format("{0} day ago", totalDays);
                }

                return string.Format("{0} days ago", totalDays);

            }
            else if (totalYear <= 0 && totalDays >= 7 && totalDays <= 21)
            {
                var totalDaysRounded = Math.Round(totalDays / 7);

                if (totalDaysRounded == 1)
                {
                    return string.Format("{0} week ago", totalDaysRounded);
                }

                return string.Format("{0} weeks ago", totalDaysRounded);
            }
            else
            {

                if (totalMonths == 1)
                {
                    return "1 month ago";
                }
                else if (totalMonths < 12)
                {
                    return string.Format("{0} months ago", totalMonths);
                }
                else
                {
                    if (totalYear == 1)
                    {
                        return "1 year ago";
                    }

                    return string.Format("{0} years ago", totalYear);

                }
            }

        }

        private static string GetVideoViewCount(ICollection<VideoView> videoViews)
        {

            if (videoViews != null && videoViews.Count > 0)
            {

                var validViews = videoViews.Where(p => p.UserId != null && p.UserId != 0).LongCount();
                if (validViews <= 1)
                {
                    return string.Format("{0} view", validViews);
                }
                else
                {
                    return string.Format("{0} views", validViews);
                }
            }

            return "0 view";
        }

        #endregion

        public async Task<object> GetVideoAsync(string hash)
        {


            List<Core.Domain.CommonType.CommonType> videoTypes = null;

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];

            try
            {

                videoTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.VideoType);

                var video = await _dataContext.Videos.AsNoTracking()
                                     .Include(e => e.User)
                                     .Include(e => e.Thumbnail)
                                     .Include(e => e.Views)
                                     .Where(p =>
                                                p.Hash == hash ||
                                                p.PaidContentHash == hash)
                                     .SingleOrDefaultAsync();

                if (video != null)
                {

                    var record = new
                        {
                            video.Title,
                            video.Description,
                            Category = GetVideoType(videoTypes, video.VideoType, false),
                            CategoryEn = GetVideoType(videoTypes, video.VideoType, true),
                            Hash = video.PaidContent == true ? video.PaidContentHash : video.Hash,
                            VideoUrl = video.PaidContent == true ? GetVideoUrlForPaidContent(_logger, _contextAccessor, _dataContext, user, video.Id, video.UserId, video.PaidContentHash) : string.Format(_videoSettings.ServerUrl, video.Hash),
                            VideoThumbnailUrl = GetVideoThumbnailUrl(_imageSettings.ServerUrl, video.Thumbnail),
                            video.User.Username,
                            UserProfilePictureUrl = video.User.ProfilePictureHash.HasValue() == true ?
                                    string.Format(_imageSettings.ServerUrl, video.User.ProfilePictureHash)
                                    : "",
                            Duration = GetVideoDuration(video.Duration),
                            PostedSince = GetVideoPostedSince(video.DateCreated),
                            video.AntiForgeryLicense,
                            TransactionHashUrl = video.TransactionHash.HasValue() == true ? string.Format(_appSettings.EthereumUrl, video.TransactionHash) : "",
                            VideoViewCount = GetVideoViewCount(video.Views),
                            DatePosted = Convert.ToDateTime(video.DateCreated).ToString("MMM dd, yyyy"),
                            video.PaidContent,
                            PaidContentPrice = string.Format("{0}{1}", _paypalSettings.Currency, video.PaidContentPrice?.ToString("N", CultureInfo.InvariantCulture)),
                            PaidContentFilPrice = video.PaidContentFilPrice,
                            video.DateCreated
                        };

                    
                    return new SuccessResponse(record);
                }

                return new ErrorResponse("Hash", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from video table: {ex}");
                _logger.Debug($"WHERE Hash={hash} OR PaidContentHash={hash}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }


        private static string GetVideoUrlForPaidContent(IWeRaveYouLog logger, IHttpContextAccessor contextAccessor, DataContext dataContext, Core.Domain.User.User user, long videoId, long userIdVideoOwner, string paidContentHash)
        {

            string url = "";

            if (user != null)
            {

                var token = TokenHelper.GetToken(contextAccessor.HttpContext);
                if (token.HasValue())
                {

                    var watchUrl = UrlHelper.GetWatchUrl(contextAccessor.HttpContext);

                    //  Check if logged in user is the video owner
                    if (user.Id == userIdVideoOwner)
                    {
                        url = string.Format("{0}{1}/{2}", watchUrl, paidContentHash, token);
                    }
                    else
                    {

                        try
                        {


                            var video = videoServiceStatic.GetVideoForSubscriber(paidContentHash, user.Id);
                            if (video != null)
                            {
                                watchUrl = watchUrl + "subscriber/{0}/{1}";
                                url = string.Format(watchUrl, paidContentHash, token);
                            }
                            else
                            {

                                watchUrl = watchUrl + "paid/";

                                var record = dataContext.PurchaseCoupons.AsNoTracking()
                                                    .Include(e => e.Purchase)
                                                    .Where(p =>
                                                                p.Purchase.UserId == user.Id &&
                                                                p.Purchase.VideoId == videoId &&
                                                                p.Purchase.PurchaseType == PurchaseType.PayPerView &&
                                                                p.Purchase.Active == true &&
                                                                p.Purchase.PurchaseStatusType == PurchaseStatusType.Active &&
                                                                p.Active == true &&
                                                                p.DateActivated != null &&
                                                                p.Expired == false)
                                                    .SingleOrDefault();

                                if (record != null)
                                {

                                    url = string.Format("{0}{1}/{2}/{3}", watchUrl, record.CouponCode, paidContentHash, token);

                                }
                            }

                        }
                        catch (Exception ex)
                        {
                            logger.Error($"While trying to get record from purchase_coupon table: {ex}");
                            logger.Debug($"WHERE purchase.UserId={user.Id} AND purchase.VideoId={videoId} AND purchase.PurchaseType ={PurchaseType.PayPerView} AND purchase.Active=1 AND purchase.PayperviewOrderStatusType={PurchaseStatusType.CouponCodeSent} AND purchase_coupon.Active=1 AND purchase_coupon.DateActivated AND purchase_coupon.Expired=0");
                        }

                    }

                }
            }

            return url;

        }

        public Core.Domain.Video.Video GetVideoForSubscriber(string paidContentHash, long userId)
        {

            try
            {

                var video = _dataContext.Videos.AsNoTracking()
                                               .Include(e => e.User)
                                                   .ThenInclude(e => e.SubscriptionSettings)
                                               .Where(p =>
                                                           p.PaidContentHash == paidContentHash &&
                                                           p.PaidContent == true)
                                               .SingleOrDefault();

                if(video != null)
                {

                    try
                    {

                        var purchase = _dataContext.Purchases.AsNoTracking()
                                                    .Where(p =>
                                                                p.UserId == userId &&
                                                                p.PurchaseType == PurchaseType.Subscription &&
                                                                p.Active == true &&
                                                                (
                                                                    p.PurchaseStatusType == PurchaseStatusType.WaitingForPayment ||
                                                                    p.PurchaseStatusType == PurchaseStatusType.Active
                                                                ) &&
                                                                p.SubscriptionSettingsId == video.User.SubscriptionSettings.Id
                                                            )
                                                    .FirstOrDefault();


                        if (purchase != null)
                        {
                            return video;
                        }
                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to get record from purchase table: {ex1}");
                        _logger.Debug($"WHERE UserId={userId} AND PurchaseType={(int)PurchaseType.Subscription} AND Active=1 AND" +
                            $"PurchaseStatusType={(int)PurchaseStatusType.WaitingForPayment} OR PurchaseStatusType={(int)PurchaseStatusType.Active} " +
                            $"SubscriptionSettingsId={video.User.SubscriptionSettings?.Id}");
                    }

                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from video table: {ex}");
                _logger.Debug($"WHERE PaidContentHash={paidContentHash} AND PaidContent=1");
            }

            return null;

        }

        public long GetVideoCount(string hash, bool useHashForPaidConentHash = false)
        {

            long count = 0;

            try
            {

                if(useHashForPaidConentHash == false)
                {
                    count = _dataContext.Videos.AsNoTracking()
                                         .Where(p =>
                                                    p.PaidContent == false &&
                                                    p.Hash == hash)
                                         .LongCount();
                }
                else
                {
                    count = _dataContext.Videos.AsNoTracking()
                                         .Where(p =>
                                                    p.PaidContent == true &&
                                                    p.PaidContentHash == hash)
                                         .LongCount();

                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from video table: {ex}");

                if (useHashForPaidConentHash == false)
                {
                    _logger.Debug($"WHERE PaidContent=0 AND Hash={hash}");
                }
                else
                {
                    _logger.Debug($"WHERE PaidContent=1 AND PaidContentHash={hash}");
                }
            }

            return count;

        }

        public long? GetVideoCount(long userId, string paidContentHash)
        {

            long? count = 0;

            try
            {

                count = _dataContext.Videos.AsNoTracking()
                                     .Where(p =>
                                                p.UserId == userId &&
                                                p.PaidContentHash == paidContentHash &&
                                                p.PaidContent == true)
                                     .LongCount();


            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from video table: {ex}");
                _logger.Debug($"WHERE UserId={userId} AND PaidContentHash={paidContentHash} AND PaidContent=1");
                count = null;
            }

            return count;

        }

        public long? GetVideoCount(long? id)
        {

            try
            {

                return _dataContext.Videos.AsNoTracking()
                                     .Where(p =>
                                                p.Id == id)
                                     .LongCount();


            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from video table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                return null;
            }

        }

        public long? GetVideoCountByIdAndArtist(long? id, string artist)
        {

            try
            {

                return _dataContext.Videos.AsNoTracking()
                                    .Include(e => e.User)
                                     .Where(p =>
                                                p.Id == id &&
                                                p.User.Username.ToLower() == artist.ToLower())
                                     .LongCount();


            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from video table: {ex}");
                _logger.Debug($"WHERE Id={id} AND user.Username={artist}");
                return null;
            }

        }

        public async Task<BaseResponse> InsertVideoAsync(Core.Domain.Video.Video video, VideoThumbnail videoThumbnail, string videoFileName, string selectedVideoThumbnail, IFormFile customVideoThumbnail)
        {

            BaseResponse response = null;

            if(video.PaidContent == true)
            {
                video.PaidContentHash = GeneratePaidContentHash();
            }

            if (video.PaidContent == true && video.PaidContentHash.HasValue() == false)
            {
                response = new ErrorResponse("PaidContent", MessageHelper.FailedGeneratingHash, ErrorCodes.FailedGeneratingHash);
            }
            else
            {

                string userUploadTempFolder = _videoSettings.GetUploadTempFolder(_appSettings.UploadFolder, video.UserId);

                var fileHelper = new FileHelper(_logger);

                var ipfsHelper = new IpfsHelper(_logger, _ipfsSettings.Host);

                string customVideoThumbnailHash = null;

                // Check if user wants to use custom thumbnail
                if (customVideoThumbnail != null)
                {

                    // Upload custom thumbnail to server
                    var uploadedCustomVideoThumbnail = await fileHelper.Upload(customVideoThumbnail, userUploadTempFolder);

                    // Check if custom thumbnail is successfully uploaded on the server
                    if (uploadedCustomVideoThumbnail.HasValue())
                    {

                        // Resize custom thumbnail                    
                        var resizedFile = fileHelper.ResizeImage(uploadedCustomVideoThumbnail, userUploadTempFolder, _appSettings.FfmpegAppPath, _imageSettings.VideoThumbnailSize);

                        // Upload custom thumbnail to IPFS node
                        customVideoThumbnailHash = await ipfsHelper.UploadFileAsync(Path.Combine(userUploadTempFolder, resizedFile));
                        if (customVideoThumbnailHash.HasValue() == false)
                        {

                            response = new ErrorResponse("CustomVideoThumbnail", MessageHelper.IPFS_FailedUploadingFile, ErrorCodes.IPFS_FailedUploadingFile);

                        }
                    }
                    else
                    {

                        response = new ErrorResponse("CustomVideoThumbnail", MessageHelper.FailedUploadingFileToServer, ErrorCodes.FailedUploadingFileToServer);

                    }

                }

                var videoHash = await ipfsHelper.UploadFileAsync(Path.Combine(userUploadTempFolder, videoFileName));
                if (videoHash.HasValue())
                {

                    //  Check if the user tries to upload the same video
                    if (this.GetVideoCount(videoHash) != 0)
                    {

                        response = new ErrorResponse("VideoFile", MessageHelper.UserUploadSameVideo, ErrorCodes.UserUploadSameVideo);

                    }
                    else
                    {

                        //  Upload thumbnail #1 to IPFS node
                        var t1 = await ipfsHelper.UploadFileAsync(Path.Combine(userUploadTempFolder, videoThumbnail.Thumbnail1));

                        // Check if thumbnail #1 is successfully uploaded on the IPFS node
                        if (t1.HasValue())
                        {
                            //  Upload thumbnail #2 to IPFS node
                            var t2 = await ipfsHelper.UploadFileAsync(Path.Combine(userUploadTempFolder, videoThumbnail.Thumbnail2));

                            // Check if thumbnail #2 is successfully uploaded on the IPFS node
                            if (t2.HasValue())
                            {

                                //  Upload thumbnail #3 to IPFS node
                                var t3 = await ipfsHelper.UploadFileAsync(Path.Combine(userUploadTempFolder, videoThumbnail.Thumbnail3));

                                // Check if thumbnail #3 is successfully uploaded on the IPFS node
                                if (t3.HasValue())
                                {

                                    string extension = fileHelper.GetFileExtension(Path.Combine(userUploadTempFolder, videoFileName));

                                    //  Get video duration
                                    var duration = fileHelper.GetVideoDuration(Path.Combine(userUploadTempFolder, videoFileName), _appSettings.FfmpegAppPath);

                                    video.Hash = videoHash;
                                    video.Duration = duration;
                                    video.FileExtension = extension;
                                    video.Size = fileHelper.GetFileSize(Path.Combine(userUploadTempFolder, videoFileName));

                                    if (video.PaidContent == false)
                                    {
                                        video.PaidContentPrice = 0;
                                    }

                                    var vidThum = t1;
                                    if (selectedVideoThumbnail == videoThumbnail.Thumbnail2)
                                    {
                                        vidThum = t2;
                                    }
                                    else if (selectedVideoThumbnail == videoThumbnail.Thumbnail3)
                                    {
                                        vidThum = t3;
                                    }

                                    video.Thumbnail = new VideoThumbnail
                                    {
                                        Thumbnail = customVideoThumbnailHash.HasValue() ? customVideoThumbnailHash : vidThum,
                                        Thumbnail1 = t1,
                                        Thumbnail2 = t2,
                                        Thumbnail3 = t3
                                    };


                                    using (var transaction = _dataContext.Database.BeginTransaction())
                                    {
                                        try
                                        {

                                            await _dataContext.Videos.AddAsync(video);

                                            await _dataContext.SaveChangesAsync();

                                            if (video.PaidContent == true)
                                            {
                                                var statisticsEntity = new Core.Domain.Statistics.Statistics
                                                {
                                                    PayPerViewId = video.Id,
                                                    PayPerViewCounter = 1,
                                                    DateCounted = DateTime.Now
                                                };

                                                await _dataContext.Statistics.AddAsync(statisticsEntity);
                                                await _dataContext.SaveChangesAsync();

                                            }

                                            string moveVideoFileName = _videoSettings.GetUploadFolder(_appSettings.UploadFolder, video.UserId) + videoHash + "." + (extension ?? "mp4");

                                            fileHelper.MoveFile(Path.Combine(userUploadTempFolder + videoFileName), moveVideoFileName);

                                            if (_ffsIntegrationSettings.Status == true)
                                            {
                                                var fileFfs = new FileFfs
                                                {
                                                    File = moveVideoFileName
                                                };

                                                await _fileFfsService.InsertFileFfsAsync(fileFfs);
                                            }

                                            response = new SuccessResponse();

                                            await transaction.CommitAsync();

                                        }
                                        catch (Exception ex)
                                        {
                                            await transaction.RollbackAsync();

                                            _logger.Error($"While trying to save record to video: {ex}");
                                            _logger.Debug($"Video={video}");
                                            response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                                        }
                                    }
                                }
                                else
                                {
                                    response = new ErrorResponse("Thumbnails", MessageHelper.FailedGeneratingThumbnails, ErrorCodes.FailedGeneratingThumbnails);
                                }

                            }
                            else
                            {
                                response = new ErrorResponse("Thumbnails", MessageHelper.FailedGeneratingThumbnails, ErrorCodes.FailedGeneratingThumbnails);
                            }
                        }
                        else
                        {
                            response = new ErrorResponse("Thumbnails", MessageHelper.FailedGeneratingThumbnails, ErrorCodes.FailedGeneratingThumbnails);
                        }
                    }

                }
                else
                {

                    return new ErrorResponse("VideoFile", MessageHelper.IPFS_FailedUploadingFile, ErrorCodes.IPFS_FailedUploadingFile);

                }

            }

            return response;

        }

        public string GeneratePaidContentHash()
        {

            string hash = null;

            try
            {

                while (true)
                {

                    hash = _appSettings.PaidContentHashPrefix + KeyHelper.Generate(_appSettings.PaidContentHashLength);

                    var count = _dataContext.Videos.AsNoTracking()
                                         .Where(p =>
                                                    p.PaidContentHash == hash)
                                         .LongCount();

                    if(count == 0)
                    {
                        break;
                    }

                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from video table: {ex}");
                _logger.Debug($"WHERE PaidContentHash={hash}");
            }


            return hash;
        }

        public async Task<BaseResponse> InsertVideoAsync(List<Core.Domain.Video.Video> videos)
        {
            try
            {
                await _dataContext.Videos.AddRangeAsync(videos);
                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to video table: {ex}");
                _logger.Debug($"Videos: {videos}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public Core.Domain.Video.Video GetVideo(string paidContentHash)
        {

            try
            {
                var video = _dataContext.Videos.AsNoTracking()
                                         .Where(p =>
                                                    p.PaidContentHash == paidContentHash)
                                         .SingleOrDefault();

                return video;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from video table: {ex}");
                _logger.Debug($"WHERE PaidContentHash={paidContentHash}");
                return null;
            }

        }

        public async Task<object> GetListAsync(ArtistVideoFilter filter)
        {

            RecordListResponse response = null;

            try
            {

                if (filter.ArtistName.HasValue() == false)
                {
                    return new ErrorResponse("ArtistName", MessageHelper.Required, ErrorCodes.Required);
                }

                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user == null)
                {
                    return new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
                }

                SetDefaultIfSetValuesAreNotValid(filter);

                var list = await _dataContext
                                        .Videos
                                        .AsNoTracking()
                                        .Include(e => e.User)
                                        .Where(p =>
                                                    p.User.Username.Equals(filter.ArtistName, StringComparison.OrdinalIgnoreCase) &&
                                                    p.User.UserType == UserType.Creator
                                            )
                                        .ToListAsync();

                if (list.Count > 0)
                {

                    var videoTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.VideoType);

                    var records = list.Select(p => new
                    {
                        Title = p.Title,
                        Description = p.Description,
                        Category = GetVideoType(videoTypes, p.VideoType, false),
                        CategoryEn = GetVideoType(videoTypes, p.VideoType, true),
                        Hash = p.PaidContent == true ? p.PaidContentHash : p.Hash,
                        VideoThumbnailUrl = GetVideoThumbnailUrl(_imageSettings.ServerUrl, p.Thumbnail),
                        Username = p.User.Username,
                        UserProfilePictureUrl = p.User.ProfilePictureHash.HasValue() == true ?
                                                                        string.Format(_imageSettings.ServerUrl, p.User.ProfilePictureHash)
                                                                        : "",
                        Duration = GetVideoDuration(p.Duration),
                        PostedSince = GetVideoPostedSince(p.DateCreated),
                        VideoViewCount = GetVideoViewCount(p.Views),
                        DatePosted = Convert.ToDateTime(p.DateCreated).ToString("MMM dd, yyyy"),
                        PaidContent = p.PaidContent,
                        PaidContentPrice = string.Format("{0}{1}", _paypalSettings.Currency, p.PaidContentPrice?.ToString("N", CultureInfo.InvariantCulture)),
                        PaidContentFilPrice = p.PaidContentFilPrice,
                        DateCreated = p.DateCreated,
                        Purchased = CheckIfUserAlreadyPurchasedPayperView(user?.Id, p.Id),
                        Subscribed = CheckIfUserAlreadySubscribedToArtist(user?.Id, p.UserId)
                    });

                    response = new RecordListResponse(records.Count(), filter.RecordPerPage);

                    if (response.Total > 0)
                    {
                        records = records.Skip((filter.CurrentPage - 1) * filter.RecordPerPage)
                                .Take(filter.RecordPerPage).ToList();
                    }

                    response.Filter = filter;
                    response.Data.AddRange(records);

                    return response;
                }


            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from video table: {ex}");
                _logger.Debug($"WHERE");
            }

            response = new RecordListResponse(0, filter.RecordPerPage);
            response.Filter = filter;
            return response;

        }

    }

    public class FRONT_RecommendedPayPerViewList
    {
        public string Title { get; internal set; }
        public string Description { get; internal set; }
        public string Category { get; internal set; }
        public string CategoryEn { get; internal set; }
        public string Hash { get; internal set; }
        public string VideoThumbnailUrl { get; internal set; }
        public string Username { get; internal set; }
        public string UserProfilePictureUrl { get; internal set; }

        public string Duration { get; internal set; }
        public string PostedSince { get; internal set; }
        public string VideoViewCount { get; internal set; }
        public string DatePosted { get; internal set; }
        public bool PaidContent { get; internal set; }
        public string PaidContentPrice { get; internal set; }

        public double? PaidContentFilPrice { get; internal set; }

        public DateTime? DateCreated { get; internal set; }

        public bool Subscribed { get; internal set; }

        [IgnoreDataMember]
        public bool Purchased { get; internal set; }
    }

}
