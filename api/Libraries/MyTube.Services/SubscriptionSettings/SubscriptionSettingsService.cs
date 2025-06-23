using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Domain.SubscriptionSettings.Enums;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Domain.Video;
using MyTube.Core.Domain.Video.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.CommonType;
using MyTube.Services.Helpers.Filter.Artist;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;

namespace MyTube.Services.SubscriptionSettings
{
    public class SubscriptionSettingsService : ISubscriptionSettingsService
    {
        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppSettings _appSettings;
        private readonly ICommonTypeService _commonTypeService;
        private readonly ImageSettings_v2 _imageSettings;
        private readonly PaypalSettings_v2 _paypalSettings;

        public SubscriptionSettingsService(DataContext dataContext, IWeRaveYouLog logger,
                                            IHttpContextAccessor contextAccessor, IOptions<AppSettings> appSettings,
                                            ICommonTypeService commonTypeService,
                                            ISysSettingsService sysSettingsService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _contextAccessor = contextAccessor;
            _appSettings = appSettings.Value;
            _commonTypeService = commonTypeService;

            var settings = sysSettingsService.GetSysSettingsList();
            _paypalSettings = SysSettingsHelper.GetPaypalSettings(settings, _logger);
            _imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);

        }

        public async Task<BaseResponse> GetSubscriptionSettingsAsync()
        {

            BaseResponse response = null;

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                try
                {
                    var settings = await _dataContext.SubscriptionSettings.AsNoTracking()
                                        .Where(p =>
                                                    p.UserId == user.Id)
                                        .SingleOrDefaultAsync();

                    if(settings == null)
                    {
                        response = new SuccessResponse(new
                        {
                            Amount = "0.00",
                            _paypalSettings.Currency,
                            Status = 0
                        });
                    }
                    else
                    {
                        response = new SuccessResponse(new 
                        {
                            settings.Amount,
                            _paypalSettings.Currency,
                            Status = settings.SubscriptionSettingsType == SubscriptionSettingsType.Inactive ? 0 : 1
                        });
                    }


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from subscription_settings table: {ex}");
                    _logger.Debug($"WHERE UserId={user.Id}");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }
            }
            else
            {
                _logger.Debug($"Cannot get user information from HttpContext: {_contextAccessor}");
                response = new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
            }

            return response;

        }

        public async Task<BaseResponse> InsertUpdateSubscriptionSettingsAsync(long userId, bool? onSubscription, double? amount)
        {
            try
            {

                var record = await _dataContext.Users
                                    .Include(e => e.SubscriptionSettings)
                                    .Where(p =>
                                            p.Id == userId)
                                    .SingleOrDefaultAsync();

                var statisticsEntity = new Core.Domain.Statistics.Statistics
                {
                    DateCounted = DateTime.Now
                };

                try
                {

                    if (record.SubscriptionSettings == null)
                    {
                        record.SubscriptionSettings = new Core.Domain.SubscriptionSettings.SubscriptionSettings
                        {
                            Amount = Convert.ToDouble(amount),
                            SubscriptionSettingsType = SubscriptionSettingsType.Created
                        };

                        statisticsEntity.SubscriptionCounter = 1;

                    }
                    else
                    {

                        if (onSubscription == true)
                        {

                            if (record.SubscriptionSettings.SubscriptionSettingsType == SubscriptionSettingsType.Inactive)
                            {
                                statisticsEntity.SubscriptionId = record.SubscriptionSettings.Id;
                                statisticsEntity.SubscriptionCounter = 1;
                            }

                            if (record.SubscriptionSettings.Amount != Convert.ToDouble(amount))
                            {
                                record.SubscriptionSettings.Amount = Convert.ToDouble(amount);
                                record.SubscriptionSettings.SubscriptionSettingsType = SubscriptionSettingsType.Created;
                            }
                            else
                            {
                                if(record.SubscriptionSettings.Ref_PlanId == null)
                                {
                                    record.SubscriptionSettings.SubscriptionSettingsType = SubscriptionSettingsType.Created;
                                }
                                else
                                {
                                    record.SubscriptionSettings.SubscriptionSettingsType = SubscriptionSettingsType.Active;
                                }
                            }

                        }
                        else
                        {
                            record.SubscriptionSettings.SubscriptionSettingsType = SubscriptionSettingsType.Inactive;
                            statisticsEntity.SubscriptionId = record.SubscriptionSettings.Id;
                            statisticsEntity.SubscriptionCounter = -1;
                        }

                    }

                    record.Subscription = (bool)onSubscription;

                    _dataContext.Users.Update(record);

                    await _dataContext.SaveChangesAsync();

                    if (statisticsEntity.SubscriptionCounter != 0)
                    {
                        if (statisticsEntity.SubscriptionId == 0)
                        {
                            statisticsEntity.SubscriptionId = record.SubscriptionSettings.Id;
                        }

                        await _dataContext.Statistics.AddAsync(statisticsEntity);
                        await _dataContext.SaveChangesAsync();
                    }


                    return new SuccessResponse(new 
                    { 
                        record.SubscriptionSettings.Amount, 
                        Status = record.SubscriptionSettings.SubscriptionSettingsType == SubscriptionSettingsType.Inactive ? 0 : 1
                    });

                }
                catch (Exception ex)
                {
                    if (record.SubscriptionSettings == null)
                    {
                        _logger.Error($"While trying to save subscription_settings record: {ex}");
                        _logger.Debug($"UserId={userId} Amount={amount} SubscriptionSettingsType={SubscriptionSettingsType.Created}");
                    }
                    else
                    {
                        _logger.Error($"While trying to update subscription_settings record: {ex}");
                        _logger.Debug($"SubscriptionSettingsType={record.SubscriptionSettings.SubscriptionSettingsType},Amount={amount} WHERE UserId={userId}");
                    }

                    return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);

                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user join subscription_settings: {ex}");
                _logger.Debug($"WHERE Id={userId}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public long? GetSubscriptionSettingsCount(long userId, SubscriptionSettingsType[] types)
        {

            try
            {
                return _dataContext.SubscriptionSettings.AsNoTracking()
                            .Where(p =>
                                        p.UserId == userId &&
                                        types.Contains(p.SubscriptionSettingsType))
                            .LongCount();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from subscription_settings table: {ex}");
                _logger.Debug($"WHERE UserId={userId} AND SubscriptionSettingsType={types}");
                return null;
            }

        }

        public long? GetSubscriptionSettingsCount(string artist, bool subscription, UserType userType, UserStatusType userStatusType, SubscriptionSettingsType subscriptionSettingsType)
        {
            try
            {
                if(subscriptionSettingsType == SubscriptionSettingsType.Active)
                {
                    return _dataContext.SubscriptionSettings.AsNoTracking()
                                                .Include(e => e.User)
                                                .Where(p =>
                                                            p.User.Username.ToLower() == artist &&
                                                            p.User.Subscription == subscription &&
                                                            p.User.UserType == userType &&
                                                            p.User.UserStatusType == userStatusType &&
                                                            p.SubscriptionSettingsType == subscriptionSettingsType &&
                                                            p.Ref_PlanId != null)
                                                .LongCount();
                }

                return _dataContext.SubscriptionSettings.AsNoTracking()
                            .Include(e => e.User)
                            .Where(p =>
                                        p.User.Username.ToLower() == artist &&
                                        p.User.Subscription == subscription &&
                                        p.User.UserType == userType &&
                                        p.User.UserStatusType == userStatusType &&
                                        p.SubscriptionSettingsType == subscriptionSettingsType)
                            .LongCount();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from subscription_settings table: {ex}");
                
                if(subscriptionSettingsType == SubscriptionSettingsType.Active)
                {
                    _logger.Debug($"WHERE user.Username={artist} AND user.Subscription={subscription} AND user.UserType={userType} AND user.UserStatusType={userStatusType}  AND SubscriptionSettingsType={subscriptionSettingsType} AND Ref_PlanId != null");
                }
                else
                {
                    _logger.Debug($"WHERE user.Username={artist} AND user.Subscription={subscription} AND user.UserType={userType} AND user.UserStatusType={userStatusType}  AND SubscriptionSettingsType={subscriptionSettingsType}");
                }

                return null;
            }
        }

        public async Task<List<Core.Domain.SubscriptionSettings.SubscriptionSettings>> GetSubscriptionSettingsListAsync(SubscriptionSettingsType subscriptionSettingsType)
        {

            try
            {

                var records = await _dataContext.SubscriptionSettings.AsNoTracking()
                                        .Include(e => e.User)
                                        .Where(p =>
                                                    p.SubscriptionSettingsType == subscriptionSettingsType)
                                        .ToListAsync();

                return records;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from subscription_settings table: {ex}");
                _logger.Debug($"WHERE SubscriptionSettingsType={subscriptionSettingsType}");
                return null;
            }

        }

        public async Task<BaseResponse> UpdateSubscriptionSettingsAsync(long id, string planId, SubscriptionSettingsType subscriptionSettingsType)
        {

            try
            {

                var record = await _dataContext.SubscriptionSettings
                                        .Where(p =>
                                                    p.Id == id)
                                        .SingleOrDefaultAsync();

                if(record != null)
                {

                    try
                    {
                        record.Ref_PlanId = planId;
                        record.SubscriptionSettingsType = subscriptionSettingsType;

                        _dataContext.SubscriptionSettings.Update(record);

                        await _dataContext.SaveChangesAsync();

                        return new SuccessResponse();
                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update subscription_settings record: {ex1}");
                        _logger.Debug($"Ref_PlanId={planId},SubscriptionSettingsType={subscriptionSettingsType} WHERE Id={id}");
                        return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }

                return new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from subscription_settings table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public async Task<object> FilterSubscriptionSettingsListAsync(ArtistFilter filter)
        {

            List<Core.Domain.User.User> artists = null;

            try
            {

                SetDefaultIfSetValuesAreNotValid(filter);

                artists = await _dataContext.Users.AsNoTracking()
                                    .Include(e => e.SubscriptionSettings)
                                    .Where(p => 
                                                p.Subscription == true &&
                                                p.UserStatusType == UserStatusType.Active &&
                                                p.SubscriptionSettings.SubscriptionSettingsType == SubscriptionSettingsType.Active &&
                                                p.SubscriptionSettings.Ref_PlanId != null)
                                    .ToListAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from videos table: {ex}");
                _logger.Debug($"WHERE video.User.Subscription=1 AND video.User.SubscriptionSettings.SubscriptionSettingsType={SubscriptionSettingsType.Active} AND video.User.SubscriptionSettings.Ref_PlanId!=null");
            }

            if (artists != null)
            {

                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];

                artists = FilterRecords(filter, artists);

                var records = artists.Select(p => new FRONT_RecommendedSubscriptionList
                {
                    ArtistId = p.Id,
                    Artist = p.Username,
                    ArtistProfilePictureUrl = p.ProfilePictureHash.HasValue() == true ?
                                    string.Format(_imageSettings.ServerUrl, p.ProfilePictureHash)
                                    : "",
                    Amount = string.Format("{0}{1}", _paypalSettings.Currency, p.SubscriptionSettings.Amount.ToString("N", CultureInfo.InvariantCulture)),
                    Subscribed = CheckIfUserAlreadySubscribedToArtist(user?.Id, p.SubscriptionSettings.Id)
                });

                records = records.Where(p => p.Subscribed == false);

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

        private bool CheckIfUserAlreadySubscribedToArtist(long? userId, long subscriptionSettingsId)
        {

            if(userId.HasValue == false)
            {
                return false;
            }

            try
            {

                return _dataContext.Purchases.AsNoTracking()
                        .Where(p =>
                                    p.UserId == userId &&
                                    p.SubscriptionSettingsId == subscriptionSettingsId &&
                                    p.PurchaseType == PurchaseType.Subscription &&
                                    (
                                        p.PurchaseStatusType == PurchaseStatusType.Active ||
                                        p.PurchaseStatusType == PurchaseStatusType.WaitingForPayment
                                    )
                            )
                        .Count() > 0;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={userId} AND SubscriptionSettingsId={subscriptionSettingsId} AND PurchaseType={(int)PurchaseType.Subscription} AND " +
                    $"PurchaseStatusType={(int)PurchaseStatusType.Active} OR PurchaseStatusType={(int)PurchaseStatusType.WaitingForPayment}");

                return false;
            }
        }

        public async Task<BaseResponse> GetArtistVideosAsync(ArtistFilter filter)
        {

            Core.Domain.Purchase.Purchase purchase = null;

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {

                try
                {

                    purchase = await _dataContext.Purchases.AsNoTracking()
                                                .Include(e => e.Subscriptions)
                                                .Include(e => e.SubscriptionSettings)
                                                    .ThenInclude(e => e.User)
                                                .Where(p =>
                                                            p.UserId == user.Id &&
                                                            p.PurchaseType == PurchaseType.Subscription &&
                                                            p.Active == true &&
                                                            p.PurchaseStatusType == PurchaseStatusType.Active &&
                                                            p.SubscriptionSettings.Ref_PlanId != null &&
                                                            p.SubscriptionSettings.SubscriptionSettingsType == SubscriptionSettingsType.Active &&
                                                            p.SubscriptionSettings.User.Username.ToLower() == filter.Artist.ToLower() &&
                                                            p.SubscriptionSettings.User.Subscription == true &&
                                                            p.SubscriptionSettings.User.UserStatusType == UserStatusType.Active &&
                                                            p.SubscriptionSettings.User.UserType == UserType.Creator)
                                                .FirstOrDefaultAsync();


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from purchase table joined subscription, subscription_settings and subscription_settings.user: {ex}");
                    _logger.Debug($"WHERE UserId={user.Id} AND PurchaseType={Core.Domain.Purchase.Enums.PurchaseType.Subscription} AND Active=1 AND Subscription.Ref_DatePaid != null AND SubscriptionSettings.Ref_PlanId != null AND SubscriptionSettings.SubscriptionSettingsType={SubscriptionSettingsType.Active} AND SubscriptionSettings.User.Username.ToLower()={ filter.Artist?.ToLower()} AND SubscriptionSettings.User.Subscription = 1 AND SubscriptionSettings.User.UserStatusType={ UserStatusType.Active} AND SubscriptionSettings.User.UserType={ UserType.Creator}");
                    return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }
            }

            try
            {

                SetDefaultIfSetValuesAreNotValid(filter);

                var videos = await _dataContext.Videos.AsNoTracking()
                                    .Include(e => e.User)
                                        .ThenInclude(e => e.SubscriptionSettings)
                                    .Include(e => e.Thumbnail)
                                    .Where(p =>
                                                p.PaidContent == true &&
                                                p.PaidContentHash != null &&
                                                p.User.Username.Equals(filter.Artist, StringComparison.OrdinalIgnoreCase))
                                    .ToListAsync();

                var videoTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.VideoType);

                RecordListResponse response = null;

                if (videos != null)
                {

                    var records = videos.Select(p => new
                    {
                        DateSubscribed = purchase == null ? "" : GetArtistSubscriptionDate(purchase.Subscriptions),
                        ArtistId = p.UserId,
                        Artist = p.User.Username,
                        ArtistProfilePictureUrl = p.User.ProfilePictureHash.HasValue() == true ?
                                string.Format(_imageSettings.ServerUrl, p.User.ProfilePictureHash)
                                : "",
                        Amount = string.Format("{0}{1}", _paypalSettings.Currency, p.User.SubscriptionSettings.Amount.ToString("N", CultureInfo.InvariantCulture)),
                        p.Title,
                        p.Description,
                        Category = GetVideoType(videoTypes, p.VideoType, false),
                        CategoryEn = GetVideoType(videoTypes, p.VideoType, true),
                        p.Hash,
                        VideoThumbnailUrl = GetVideoThumbnailUrl(_imageSettings.ServerUrl, p.Thumbnail)
                    });

                    response = new RecordListResponse(records.Count(), filter.RecordPerPage);

                    if (response.Total > 0)
                    {
                        records = records.Skip((filter.CurrentPage - 1) * filter.RecordPerPage)
                                .Take(filter.RecordPerPage);
                    }

                    response.Data.AddRange(records);

                }
                else
                {
                    response = new RecordListResponse(0, filter.RecordPerPage);
                }

                response.Filter = filter;
                return response;

            }
            catch (Exception ex1)
            {
                _logger.Error($"While trying to get record from videos table: {ex1}");
                _logger.Debug($"WHERE PaidContent=1 AND video.User.Subscription=1 AND video.User.SubscriptionSettings.SubscriptionSettingsType={SubscriptionSettingsType.Active} AND video.User.SubscriptionSettings.Ref_PlanId!=null");
                return new ErrorResponse("Database", MessageHelper.Error404, ErrorCodes.Error404);
            }

        }

        private string GetArtistSubscriptionDate(ICollection<Core.Domain.Purchase.PurchaseSubscription> subscriptions)
        {
            if (subscriptions != null)
            {
                if (subscriptions.LongCount() > 0)
                {
                    var sub = subscriptions.FirstOrDefault();
                    if (sub != null)
                    {
                        return sub.Ref_DatePaid?.ToString("yyyy/MM/dd");
                    }
                }
            }

            return "";

        }

        private static string GetVideoThumbnailUrl(string imageServerUrl, VideoThumbnail thumbnail)
        {
            if (thumbnail != null)
            {

                return string.Format(imageServerUrl, thumbnail.Thumbnail);

            }

            return null;

        }

        private List<Core.Domain.User.User> FilterRecords(ArtistFilter filter, List<Core.Domain.User.User> users)
        {
            if (filter.Keyword.HasValue())
            {

                //  Search users by keyword
                users = users.Where(p =>
                                            p.Username.Contains(filter.Keyword))
                                .ToList();

            }

            return users;
        }

        private static string GetVideoType(List<Core.Domain.CommonType.CommonType> videoTypes, VideoType videoType, bool englishName)
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

        private void SetDefaultIfSetValuesAreNotValid(ArtistFilter filter)
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

        public Core.Domain.SubscriptionSettings.SubscriptionSettings GetSubscriptionSettings(string artist, bool subscription, UserType userType, UserStatusType userStatusType, SubscriptionSettingsType subscriptionSettingsType)
        {

            try
            {
                if (subscriptionSettingsType == SubscriptionSettingsType.Active)
                {
                    return _dataContext.SubscriptionSettings.AsNoTracking()
                                                .Include(e => e.User)
                                                .Where(p =>
                                                            p.User.Username.ToLower() == artist &&
                                                            p.User.Subscription == subscription &&
                                                            p.User.UserType == userType &&
                                                            p.User.UserStatusType == userStatusType &&
                                                            p.SubscriptionSettingsType == subscriptionSettingsType &&
                                                            p.Ref_PlanId != null)
                                                .SingleOrDefault();
                }

                return _dataContext.SubscriptionSettings.AsNoTracking()
                            .Include(e => e.User)
                            .Where(p =>
                                        p.User.Username.ToLower() == artist &&
                                        p.User.Subscription == subscription &&
                                        p.User.UserType == userType &&
                                        p.User.UserStatusType == userStatusType &&
                                        p.SubscriptionSettingsType == subscriptionSettingsType)
                            .SingleOrDefault();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from subscription_settings table: {ex}");
                if (subscriptionSettingsType == SubscriptionSettingsType.Active)
                {
                    _logger.Debug($"WHERE user.Username={artist} AND user.Subscription={subscription} AND user.UserType={userType} AND user.UserStatusType={userStatusType}  AND SubscriptionSettingsType={subscriptionSettingsType} AND Ref_PlanId != null");
                }
                else
                {
                    _logger.Debug($"WHERE user.Username={artist} AND user.Subscription={subscription} AND user.UserType={userType} AND user.UserStatusType={userStatusType}  AND SubscriptionSettingsType={subscriptionSettingsType}");
                }

                return null;
            }

        }

    }

    public class FRONT_RecommendedSubscriptionList
    {
        public long ArtistId { get; internal set; }
        public string Artist { get; internal set; }
        public string ArtistProfilePictureUrl { get; internal set; }

        public string Amount { get; internal set; }
        [IgnoreDataMember]
        public bool Subscribed { get; internal set; }
    }

}
