using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Domain.Webinar.Enums;
using MyTube.Data;
using MyTube.Services.CommonType;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;
using MyTube.Services.Video;
using MyTube.Services.Webinar;

namespace MyTube.Services.Banner
{
    public class BannerService : IBannerService
    {

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly ICommonTypeService _commonTypeService;
        private readonly ISysSettingsService _sysSettingsService;
        private readonly Core.Domain.User.User _loggedInUser;

        public BannerService(DataContext dataContext, IWeRaveYouLog logger,
                                ICommonTypeService commonTypeService, ISysSettingsService sysSettingsService,
                                IHttpContextAccessor contextAccessor)
        {
            _dataContext = dataContext;
            _logger = logger;
            _commonTypeService = commonTypeService;
            _sysSettingsService = sysSettingsService;

            _loggedInUser = (Core.Domain.User.User)contextAccessor.HttpContext.Items["User"];
        }

        public async Task<object> GetListAsync(int? displayRecord, bool? liveTicket)
        {

            if(displayRecord.HasValue == false)
            {
                return new ErrorResponse("DisplayRecord", MessageHelper.Required, ErrorCodes.Required);
            }

            if (displayRecord == 0)
            {
                displayRecord = 10;
            }

            var setting = await _sysSettingsService.GetSysSettingsListAsync();

            var imageServerUrl = SysSettingsHelper.GetImageServerUrl(setting, _logger);
            var paypalCurrency = SysSettingsHelper.GetPaypalCurrency(setting, _logger);

            var videoTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.VideoType);


            List<Banner_List> webinars = null;
            if (liveTicket == true || liveTicket == null)
            {
                webinars = await GetWebinars(imageServerUrl, paypalCurrency, videoTypes);
            }

            List<Banner_List> videos = null;
            if(liveTicket == false || liveTicket == null)
            {
                videos = await GetVideos(imageServerUrl, paypalCurrency, videoTypes);
            }

            var list = new List<Banner_List>();
            if(webinars != null && webinars.Count > 0)
            {
                list.AddRange(webinars);
            }

            if (videos != null && videos.Count > 0)
            {
                list.AddRange(videos);
            }

            if (list.Count > 0)
            {
                return new SuccessResponse(list.OrderByDescending(p => p.DateCreated).Take((int)displayRecord).ToList());
            }

            return new SuccessResponse(list);

        }

        private async Task<List<Banner_List>> GetVideos(string imageServerUrl, string paypalCurrency, List<Core.Domain.CommonType.CommonType> videoTypes)
        {
            try
            {
                var records = await _dataContext.Videos.AsNoTracking()
                                        .Include(e => e.Thumbnail)
                                        .Include(e => e.User)
                                        .Where(p =>
                                                    p.PaidContent == true &&
                                                    p.PaidContentHash != null)
                                        .OrderByDescending(p => p.Id)
                                        .ToListAsync();

                var list = records.Select(p => new Banner_List
                {
                    Id = p.Id,
                    Name = p.Title,
                    Author = p.User.Username,
                    VideoDuration = VideoService.GetVideoDuration(p.Duration),
                    Thumbnail = VideoService.GetVideoThumbnailUrl(imageServerUrl, p.Thumbnail),
                    Hash = p.PaidContentHash,
                    Category = VideoService.GetVideoType(videoTypes, p.VideoType, false),
                    CategoryEn = VideoService.GetVideoType(videoTypes, p.VideoType, true),
                    IsPayPerView = true,
                    Price = string.Format("{0}{1}", paypalCurrency, Convert.ToDouble(p.PaidContentPrice).ToString("N", CultureInfo.InvariantCulture)),
                    PriceFil = p.PaidContentFilPrice,
                    Purchased = CheckIfUserAlreadyPurchasedPayperView(p.Id),
                    Subscribed = CheckIfUserAlreadySubscribedToArtist(p.UserId),
                    DateCreated = Convert.ToDateTime(p.DateCreated)
                }).ToList();

                return list.Where(p => p.Purchased == false).ToList();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from video table: {ex}");
                return null;
            }
        }

        private bool CheckIfUserAlreadyPurchasedPayperView(long videoId)
        {
            if (_loggedInUser == null)
            {
                return false;
            }

            try
            {

                return _dataContext.Purchases.AsNoTracking()
                        .Where(p =>
                                    p.UserId == _loggedInUser.Id &&
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
                _logger.Debug($"WHERE UserId={_loggedInUser.Id} AND VideoId={videoId} AND PurchaseType={(int)PurchaseType.PayPerView} AND " +
                    $"PurchaseStatusType={(int)PurchaseStatusType.Captured} OR PurchaseStatusType={(int)PurchaseStatusType.CouponCodeSent} OR PurchaseStatusType={(int)PurchaseStatusType.Active}");
            }

            return false;
        }

        private async Task<List<Banner_List>> GetWebinars(string imageServerUrl, string paypalCurrency, List<Core.Domain.CommonType.CommonType> videoTypes)
        {
            try
            {
                var records = await _dataContext.Webinars.AsNoTracking()
                                        .Include(e => e.CreatedByUser)
                                        .Where(p =>
                                                    p.Active == true &&
                                                    p.WebinarStatusType == WebinarStatusType.ScheduleLive &&
                                                    p.LiveTicket == true &&
                                                    p.LiveTicketHash != null &&
                                                    p.WebinarStart > DateTime.Now &&
                                                    p.TopPageAnnouncement == true &&
                                                    p.LiveTicketRemaining > 0)
                                        .ToListAsync();

                var list = records.Select(p => new Banner_List
                {
                    Id = p.Id,
                    Name = p.LiveName,
                    Author = p.CreatedByUser.Username,
                    Thumbnail = string.Format(imageServerUrl, p.Hash),
                    LiveSchedule = p.WebinarStart.ToString("yyyy-MM-dd HH:mm"),
                    Hash = p.PaidContentHash,
                    Category = WebinarService.GetWebinarType(videoTypes, p.VideoType, false),
                    CategoryEn = WebinarService.GetWebinarType(videoTypes, p.VideoType, true),
                    IsPayPerView = false,
                    Price = string.Format("{0}{1}", paypalCurrency, Convert.ToDouble(p.PaidContentPrice).ToString("N", CultureInfo.InvariantCulture)),
                    PriceFil = p.PaidContentFilPrice,
                    Subscribed = CheckIfUserAlreadySubscribedToArtist(p.CreatedBy),
                    Purchased = CheckIfUserAlreadyPurchasedWebinar(p.Id),
                    DateCreated = Convert.ToDateTime(p.DateCreated)
                }).ToList();

                return list.Where(p => p.Purchased == false).ToList();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from webinar table: {ex}");
                return null;
            }
        }

        private bool CheckIfUserAlreadyPurchasedWebinar(long webinarId)
        {
            if (_loggedInUser == null)
            {
                return false;
            }

            try
            {

                return _dataContext.Purchases.AsNoTracking()
                        .Where(p =>
                                    p.UserId == _loggedInUser.Id &&
                                    p.WebinarId == webinarId &&
                                    p.PurchaseType == PurchaseType.LiveTicket &&
                                    (
                                        p.PurchaseStatusType == PurchaseStatusType.Captured ||
                                        p.PurchaseStatusType == PurchaseStatusType.Active
                                    )
                            )
                        .Count() > 0;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={_loggedInUser.Id} AND WebinarId={webinarId} AND PurchaseType={(int)PurchaseType.LiveTicket} AND " +
                    $"PurchaseStatusType={(int)PurchaseStatusType.Captured} OR PurchaseStatusType={(int)PurchaseStatusType.Active}");

                return false;
            }
        }

        private bool CheckIfUserAlreadySubscribedToArtist(long artistId)
        {
            if (_loggedInUser == null)
            {
                return false;
            }

            try
            {

                var purchasedSubscription = _dataContext.Purchases.AsNoTracking()
                                    .Include(e => e.SubscriptionSettings)
                                    .Where(p =>
                                                p.UserId == _loggedInUser.Id &&
                                                p.PurchaseType == PurchaseType.Subscription &&
                                                (
                                                    p.PurchaseStatusType == PurchaseStatusType.WaitingForPayment ||
                                                    p.PurchaseStatusType == PurchaseStatusType.Active
                                                ) &&
                                                p.Active == true &&
                                                p.SubscriptionSettings.UserId == artistId)
                                    .FirstOrDefault();

                if (purchasedSubscription != null)
                {
                    return true;
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={_loggedInUser.Id} AND PurchaseType={(int)PurchaseType.Subscription} AND " +
                    $"PurchaseStatusType={(int)PurchaseStatusType.WaitingForPayment} OR PurchaseStatusType={(int)PurchaseStatusType.Active}" +
                    $"AND Active=1 AND subscription_settings.UserId={artistId} ");
            }

            return false;

        }

    }

    public class Banner_List
    {
        public long Id { get; internal set; }

        public bool IsPayPerView { get; internal set; }

        public string Name { get; internal set; }

        public string Author { get; internal set; }

        public string LiveSchedule { get; internal set; }

        public string Hash { get; internal set; }

        public string Category { get; internal set; }

        public string CategoryEn { get; internal set; }

        public string Price { get; internal set; }

        public double? PriceFil { get; internal set; }

        public string VideoDuration { get; internal set; }

        public string Thumbnail { get; internal set; }

        public bool Subscribed { get; internal set; }

        [JsonIgnore]
        public bool Purchased { get; internal set; }

        [JsonIgnore]
        public DateTime DateCreated { get; internal set; }

    }


}
