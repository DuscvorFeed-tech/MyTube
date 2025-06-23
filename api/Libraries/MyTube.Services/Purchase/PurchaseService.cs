using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Caches.Enums;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Core.Domain.Video;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.Caches;
using MyTube.Services.CommonType;
using MyTube.Services.Helpers.Filter.Purchase;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Paypal;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;
using MyTube.Services.Webinar;

namespace MyTube.Services.Purchase
{
    public class PurchaseService : IPurchaseService
    {


        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly AppSettings _appSettings;
        private PaypalSettings_v2 _paypalSettings;
        private readonly ICommonTypeService _commonTypeService;
        private readonly ImageSettings_v2 _imageSettings;
        private readonly ISysSettingsService _settingsService;
        private readonly IWebinarService _webinarService;
        private readonly ICacheService _cacheService;

        #endregion

        #region Constructor

        public PurchaseService(DataContext dataContext, IWeRaveYouLog logger,
                                IHttpContextAccessor contextAccessor, IOptions<AppSettings> appSettings,
                                ICommonTypeService commonTypeService,
                                ISysSettingsService settingsService,
                                IWebinarService webinarService, ICacheService cacheService, 
                                ISysSettingsService sysSettingsService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _contextAccessor = contextAccessor;
            _appSettings = appSettings.Value;
            _commonTypeService = commonTypeService;
            _settingsService = settingsService;
            _webinarService = webinarService;
            _cacheService = cacheService;

            var settings = sysSettingsService.GetSysSettingsList();
            _paypalSettings = SysSettingsHelper.GetPaypalSettings(settings, _logger);
            _imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);

        }

        #endregion


        public async Task<BaseResponse> InsertPurchaseAsync(Core.Domain.Purchase.Purchase entity)
        {

            try
            {


                if(entity.PurchaseType == PurchaseType.PayPerView)
                {
                    //  Deactivate first all existing users's payperview purchases
                    _dataContext.Purchases
                            .Where(p =>
                                        p.UserId == entity.UserId &&
                                        p.VideoId == entity.VideoId &&
                                        p.PurchaseStatusType == PurchaseStatusType.Created &&
                                        p.Active == true)
                            .ToList()
                            .ForEach(p => p.Active = false);
                }
                else if(entity.PurchaseType == PurchaseType.LiveTicket)
                {
                    //  Deactivate first all existing users's payperview purchases
                    _dataContext.Purchases
                            .Where(p =>
                                        p.UserId == entity.UserId &&
                                        p.WebinarId == entity.WebinarId &&
                                        p.PurchaseStatusType == PurchaseStatusType.Created &&
                                        p.Active == true)
                            .ToList()
                            .ForEach(p => p.Active = false);
                }
                else if(entity.PurchaseType == PurchaseType.Subscription)
                {
                    //  Deactivate first all existing users's payperview purchases
                    _dataContext.Purchases
                            .Where(p =>
                                        p.UserId == entity.UserId &&
                                        p.SubscriptionSettingsId == entity.SubscriptionSettingsId &&
                                        p.PurchaseStatusType == PurchaseStatusType.Created &&
                                        p.Active == true)
                            .ToList()
                            .ForEach(p => p.Active = false);
                }
                else
                {
                    _logger.Error($"While trying to deactive all existing user's purchases. WHERE PurchaseType={entity.PurchaseType}");

                }

                await _dataContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                if (entity.PurchaseType == PurchaseType.PayPerView)
                {
                    _logger.Error($"While trying to deactive all existing user's payperview purchases: {ex}");
                    _logger.Debug($"Active=0 WHERE UserId={entity.UserId} AND VideoId={entity.VideoId} AND PurchaseStatusType={PurchaseStatusType.Created} AND Active=1");
                }
                else if(entity.PurchaseType == PurchaseType.LiveTicket)
                {
                    _logger.Error($"While trying to deactive all existing user's liveticket purchases: {ex}");
                    _logger.Debug($"Active=0 WHERE UserId={entity.UserId} AND WebinarId={entity.WebinarId} AND PurchaseStatusType={PurchaseStatusType.Created} AND Active=1");
                }
                else if(entity.PurchaseType == PurchaseType.Subscription)
                {
                    _logger.Error($"While trying to deactive all existing user's artist subscription purchases: {ex}");
                    _logger.Debug($"Active=0 WHERE UserId={entity.UserId} AND SubscriptionSettingsId={entity.SubscriptionSettingsId} AND PurchaseStatusType={PurchaseStatusType.Created} AND Active=1");
                }
                else
                {
                    _logger.Error($"While trying to deactive all existing user's purchases: {ex}");
                    _logger.Debug($"Active=0 WHERE UserId={entity.UserId} AND PurchaseType={entity.PurchaseType}");
                }
            }


            try
            {

                await _dataContext.Purchases.AddAsync(entity);

                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();
            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to save record to purchase table: {ex}");
                _logger.Debug($"Purchase: {entity}");

                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public async Task<List<Core.Domain.Purchase.Purchase>> GetPurchaseListAsync(PurchaseType purchaseType, PurchaseStatusType purchaseStatusType, SubscriptionEmailStatusType? emailStatusType = null)
        {

            List<Core.Domain.Purchase.Purchase> records = null;

            try
            {

                if (purchaseStatusType == PurchaseStatusType.Captured)
                {
                    if (purchaseType == PurchaseType.PayPerView)
                    {
                        records = await _dataContext.Purchases.AsNoTracking()
                                            .Include(e => e.User)
                                            .Include(e => e.Detail)
                                            .Include(e => e.Video)
                                                .ThenInclude(e => e.User)
                                            .Include(e => e.Coupon)
                                            .Where(p =>
                                                        p.PurchaseType == purchaseType &&
                                                        p.PurchaseStatusType == purchaseStatusType &&
                                                        p.Active == true &&
                                                        p.Detail.Ref_AuthorizationId != null &&
                                                        p.Detail.Ref_CaptureId != null)
                                            .ToListAsync();

                    }
                    else if(purchaseType == PurchaseType.LiveTicket)
                    {
                        records = await _dataContext.Purchases.AsNoTracking()
                                            .Include(e => e.User)
                                            .Include(e => e.Detail)
                                            .Include(e => e.Coupon)
                                            .Include(e => e.Webinar)
                                                .ThenInclude(e => e.CreatedByUser)
                                            .Include(e => e.Webinar)
                                                .ThenInclude(e => e.WebinarZoom)
                                            .Include(e => e.Webinar)
                                                .ThenInclude(e => e.Performers)
                                            .Where(p =>
                                                        p.PurchaseType == purchaseType &&
                                                        p.PurchaseStatusType == purchaseStatusType &&
                                                        p.Active == true &&
                                                        p.Detail.Ref_AuthorizationId != null &&
                                                        p.Detail.Ref_CaptureId != null)
                                            .ToListAsync();
                    }
                }
                else if(purchaseStatusType == PurchaseStatusType.WaitingForPayment)
                {
                    if(purchaseType == PurchaseType.Subscription)
                    {

                        if (emailStatusType == null)
                        {
                            records = await _dataContext.Purchases.AsNoTracking()
                                                .Include(e => e.User)
                                                .Include(e => e.Subscriptions)
                                                .Include(e => e.SubscriptionSettings)
                                                    .ThenInclude(e => e.User)
                                                .Where(p =>
                                                            p.PurchaseType == purchaseType &&
                                                            p.PurchaseStatusType == purchaseStatusType &&
                                                            p.Active == true)
                                                .ToListAsync();
                        }
                        else
                        {
                            records = await _dataContext.Purchases.AsNoTracking()
                                                .Include(e => e.User)
                                                .Include(e => e.Subscriptions)
                                                .Include(e => e.SubscriptionSettings)
                                                    .ThenInclude(e => e.User)
                                                .Where(p =>
                                                            p.PurchaseType == purchaseType &&
                                                            p.PurchaseStatusType == purchaseStatusType &&
                                                            p.Active == true &&
                                                            p.SubscriptionEmailStatusType == emailStatusType)
                                                .ToListAsync();
                        }
                    }
                }
                else if(purchaseStatusType == PurchaseStatusType.Active)
                {
                    if (purchaseType == PurchaseType.Subscription)
                    {
                        if(emailStatusType == SubscriptionEmailStatusType.ForSendingPaymentConfirmedEmail)
                        {
                            records = await _dataContext.Purchases.AsNoTracking()
                                                .Include(e => e.User)
                                                .Include(e => e.Subscriptions)
                                                .Include(e => e.SubscriptionSettings)
                                                    .ThenInclude(e => e.User)
                                                .Where(p =>
                                                            p.PurchaseType == purchaseType &&
                                                            p.PurchaseStatusType == purchaseStatusType &&
                                                            p.Active == true &&
                                                            p.SubscriptionEmailStatusType == emailStatusType &&
                                                            p.Subscriptions.Where(q => q.Ref_TransactionId != null).Any())
                                                .ToListAsync();

                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from purchase table: {ex}");
                _logger.Debug($"WHERE PurchaseType={purchaseType} AND PurchaseStatusType={purchaseStatusType} AND Active=1 AND purchase_detail.Ref_AuthorizationId != null && purchase_detail.Ref_CaptureId != null");
            }

            return records;

        }

        public async Task<object> GetPurchaseListAsync(PurchaseFilter filter)
        {

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user == null)
            {
                return new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
            }


            SetDefaultIfSetValuesAreNotValid(filter);

            if (filter.FilterType == PurchaseType.PayPerView)
            {
                return await GetPurchasedPayPerViews(filter, user);
            }
            else if (filter.FilterType == PurchaseType.LiveTicket)
            {
                return await GetPurchasedLiveTickets(filter, user);
            }
            else
            {
                return await GetArtistSubscriptions(filter, user);
            }

        }

        private async Task<object> GetPurchasedPayPerViews(PurchaseFilter filter, Core.Domain.User.User user)
        {
            try
            {
                var purchases = await _dataContext.Purchases.AsNoTracking()
                                                        .Include(e => e.User)
                                                        .Include(e => e.Detail)
                                                        .Include(e => e.Video)
                                                            .ThenInclude(e => e.User)
                                                        .Include(e => e.Video)
                                                            .ThenInclude(e => e.Thumbnail)
                                                        .Include(e => e.Coupon)
                                                        .Where(p =>
                                                                    p.UserId == user.Id &&
                                                                    p.PurchaseType == filter.FilterType &&
                                                                    p.Active == true &&
                                                                    p.Detail.Ref_AuthorizationId != null &&
                                                                    p.Detail.Ref_CaptureId != null)
                                                        .OrderByDescending(p => p.Id)
                                                        .ToListAsync();

                var records = purchases.Select(p => new
                {
                    p.Video.Title,
                    p.Video.User.Username,
                    VideoThumbnailUrl = GetVideoThumbnailUrl(_imageSettings.ServerUrl, p.Video.Thumbnail),
                    DatePurchased = Convert.ToDateTime(p.DateCreated).ToString("yyyy/MM/dd"),
                    p.Coupon.CouponCode,
                    Hash= p.Video.PaidContent == true ? p.Video.PaidContentHash : p.Video.Hash,
                    Amount = string.Format("{0}{1}", _paypalSettings.Currency, p.Detail.Ref_GrossAmount?.ToString("N", CultureInfo.InvariantCulture)),
                    Active = (p.Coupon.Active == true && p.Coupon.DateActivated != null && p.Coupon.Expired == false),
                    Expired = (p.Coupon.Active == false && p.Coupon.Expired == true),
                    ValidFrom = (
                                        ((p.Coupon.Active == true && p.Coupon.DateActivated != null && p.Coupon.Expired == false) == true) &&
                                        ((p.Coupon.Active == false && p.Coupon.Expired == true) == false)
                                    ) == true ? Convert.ToDateTime(p.Coupon.DateActivated).ToString("yyyy/MM/dd HH:mm") : "",
                    ValidTo = (
                                        ((p.Coupon.Active == true && p.Coupon.DateActivated != null && p.Coupon.Expired == false) == true) &&
                                        ((p.Coupon.Active == false && p.Coupon.Expired == true) == false)
                                    ) == true ? Convert.ToDateTime(p.Coupon.DateActivated).AddHours(24).ToString("yyyy/MM/dd HH:mm") : ""
                });

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
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={user.Id} AND PurchaseType={filter.FilterType} AND Active=1 AND purchase_detail.Ref_AuthorizationId != null && purchase_detail.Ref_CaptureId != null");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        private static string GetVideoThumbnailUrl(string imageServerUrl, VideoThumbnail thumbnail)
        {
            if (thumbnail != null)
            {

                return string.Format(imageServerUrl, thumbnail.Thumbnail);

            }

            return null;
        }

        private async Task<object> GetPurchasedLiveTickets(PurchaseFilter filter, Core.Domain.User.User user)
        {
            try
            {
                var purchases = await _dataContext.Purchases.AsNoTracking()
                                                        .Include(e => e.User)
                                                        .Include(e => e.Detail)
                                                        .Include(e => e.Webinar)
                                                            .ThenInclude(e => e.CreatedByUser)
                                                        .Include(e => e.Webinar)
                                                            .ThenInclude(e => e.Performers)
                                                        .Include(e => e.Webinar)
                                                            .ThenInclude(e => e.WebinarZoom)
                                                        .Where(p =>
                                                                    p.UserId == user.Id &&
                                                                    p.PurchaseType == filter.FilterType &&
                                                                    p.Active == true &&
                                                                    p.Detail.Ref_AuthorizationId != null &&
                                                                    p.Detail.Ref_CaptureId != null)
                                                        .OrderByDescending(p => p.Id)
                                                        .ToListAsync();

                var records = purchases.Select(p => new
                {
                    p.Webinar.LiveName,
                    WebinarStart = p.Webinar.WebinarStart.ToString("yyyy/MM/dd HH:mm"),
                    Performer = p.Webinar.Performers.Select(q => new { q.Name }).ToList(),
                    p.Webinar.CreatedByUser.Username,
                    ZoomUrl = p.Webinar.WebinarZoom.Zoom_join_url,
                    Thumbnail = string.Format(_imageSettings.ServerUrl, p.Webinar.Hash),
                    Amount = string.Format("{0}{1}", _paypalSettings.Currency, p.Detail.Ref_GrossAmount?.ToString("N", CultureInfo.InvariantCulture)),
                    Ended = p.Webinar.WebinarStatusType == Core.Domain.Webinar.Enums.WebinarStatusType.LiveArchive,
                    DatePurchased = p.DateCreated?.ToString("yyyy/MM/dd")
                });

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
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={user.Id} AND PurchaseType={filter.FilterType} AND Active=1 AND purchase_detail.Ref_AuthorizationId != null && purchase_detail.Ref_CaptureId != null");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }

        private async Task<object> GetArtistSubscriptions(PurchaseFilter filter, Core.Domain.User.User user)
        {
            try
            {
                var purchases = await _dataContext.Purchases.AsNoTracking()
                                                        .Include(e => e.Subscriptions)
                                                        .Include(e => e.SubscriptionSettings)
                                                            .ThenInclude(e => e.User)
                                                        .Where(p =>
                                                                    p.UserId == user.Id &&
                                                                    p.PurchaseType == filter.FilterType &&
                                                                    p.Active == true &&
                                                                    (
                                                                        p.PurchaseStatusType == PurchaseStatusType.WaitingForPayment ||
                                                                        p.PurchaseStatusType == PurchaseStatusType.Paid ||
                                                                        p.PurchaseStatusType == PurchaseStatusType.Active
                                                                    ))
                                                        .OrderByDescending(p => p.Id)
                                                        .ToListAsync();

                var purchaseStatusTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.PurchaseStatusType);

                var records = purchases.Select(p => new
                {
                    SubscriptionId = p.Subscriptions.FirstOrDefault().Id,
                    Artist = p.SubscriptionSettings.User.Username,
                    DateSubscribed = Convert.ToDateTime(p.Ref_SubscriptionStart).ToString("yyyy/MM/dd"),
                    Amount = GetArtistSubscriptionAmount(p.SubscriptionSettings, p.Subscriptions),
                    Status = GetPurchaseStatusType(purchaseStatusTypes, p.PurchaseStatusType, false),
                    StatusEn = GetPurchaseStatusType(purchaseStatusTypes, p.PurchaseStatusType, true)
                });

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
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={user.Id} AND PurchaseType={filter.FilterType} AND Active=1 AND purchase_detail.Ref_AuthorizationId != null && purchase_detail.Ref_CaptureId != null");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }

        private string GetArtistSubscriptionAmount(Core.Domain.SubscriptionSettings.SubscriptionSettings subscriptionSettings, ICollection<Core.Domain.Purchase.PurchaseSubscription> subscriptions)
        {
            var subsrciption = subscriptions.FirstOrDefault();
            if (subsrciption != null)
            {
                return string.Format("{0}{1}", _paypalSettings.Currency, (subsrciption.Ref_GrossAmount != null ? subsrciption.Ref_GrossAmount?.ToString("N", CultureInfo.InvariantCulture) : subscriptionSettings.Amount.ToString("N", CultureInfo.InvariantCulture)));
            }

            return "";

        }

        private static string GetPurchaseStatusType(List<Core.Domain.CommonType.CommonType> purchaseStatusTypes, PurchaseStatusType? purchaseStatusType, bool englishName)
        {
            string response = "";

            if (purchaseStatusTypes != null && purchaseStatusTypes.LongCount() > 0)
            {

                var purStatType = purchaseStatusTypes.Where(p => p.Value == (int)purchaseStatusType).SingleOrDefault();
                if (purStatType != null)
                {
                    response = englishName == false ? purStatType.Name : purStatType.NameEn;
                }

            }

            return response;

        }

        private void SetDefaultIfSetValuesAreNotValid(PurchaseFilter filter)
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

        public async Task<BaseResponse> UpdatePurchaseAsync(long id, PurchaseStatusType purchaseStatusType)
        {

            BaseResponse response = null;
            
            try
            {

                var record = await _dataContext.Purchases
                                        .Where(p =>
                                                    p.Id == id)
                                        .SingleOrDefaultAsync();

                if (record != null)
                {

                    try
                    {
                        record.PurchaseStatusType = purchaseStatusType;

                        _dataContext.Purchases.Update(record);

                        await _dataContext.SaveChangesAsync();

                        response = new SuccessResponse();
                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update purchase record: {ex1}");
                        _logger.Debug($"PurchaseStatusType={purchaseStatusType} WHERE Id={id}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }
                else
                {
                    _logger.Debug($"Purchase record not found. Updating PurchaseStatusType={purchaseStatusType} failed using this condition: WHERE Id={id}");
                    response = new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }


            return response;

        }

        public async Task<BaseResponse> UpdatePurchaseAsync(long id, SubscriptionEmailStatusType emailStatusType)
        {

            BaseResponse response = null;

            try
            {

                var record = await _dataContext.Purchases
                                        .Where(p =>
                                                    p.Id == id)
                                        .SingleOrDefaultAsync();

                if (record != null)
                {

                    try
                    {
                        record.SubscriptionEmailStatusType = emailStatusType;

                        _dataContext.Purchases.Update(record);

                        await _dataContext.SaveChangesAsync();

                        response = new SuccessResponse();
                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update purchase record: {ex1}");
                        _logger.Debug($"SubscriptionEmailStatusType={emailStatusType} WHERE Id={id}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }
                else
                {
                    _logger.Debug($"Purchase record not found. Updating SubscriptionEmailStatusType={emailStatusType} failed using this condition: WHERE Id={id}");
                    response = new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }


            return response;

        }

        public async Task<BaseResponse> UpdatePurchaseAsync(long id, long subscriptionId,
                                                            string ref_FirstName, string ref_LastName, 
                                                            string ref_PayerId, DateTime? ref_DatePaid,
                                                            DateTime? ref_NextBillingDate,
                                                            string ref_TransactionId,
                                                            double? ref_GrossAmount, 
                                                            double? ref_Fee, double? ref_NetAmount, 
                                                            PurchaseStatusType purchaseStatus, SubscriptionEmailStatusType emailStatusType)
        {


            BaseResponse response = null;

            try
            {

                var record = await _dataContext.Purchases
                                        .Include(e => e.Subscriptions)
                                        .Include(e => e.SubscriptionSettings)
                                            .ThenInclude(e => e.User)
                                                .ThenInclude(e => e.ProfitPercentage)
                                        .Where(p =>
                                                    p.Id == id)
                                        .SingleOrDefaultAsync();

                if (record != null)
                {

                    try
                    {

                        var subscription = record.Subscriptions.Where(p => p.Id == subscriptionId).FirstOrDefault();

                        subscription.Ref_FirstName = ref_FirstName;
                        subscription.Ref_LastName = ref_LastName;
                        subscription.Ref_PayerId = ref_PayerId;
                        subscription.Ref_DatePaid = ref_DatePaid;
                        subscription.Ref_NextBillingDate = ref_NextBillingDate;
                        subscription.Ref_TransactionId = ref_TransactionId;
                        subscription.Ref_GrossAmount = ref_GrossAmount;
                        subscription.Ref_Fee = ref_Fee;
                        subscription.Ref_NetAmount = ref_NetAmount;
                        subscription.NetAmount = GetNetAmount(ref_NetAmount, record.SubscriptionSettings.User.ProfitPercentage.Subscription);
                        record.PurchaseStatusType = purchaseStatus;
                        record.SubscriptionEmailStatusType = emailStatusType;

                        record.Sales = new Core.Domain.Sales.Sales
                        {
                            PurchaseId = record.Id,
                            PurchaseSubscriptionId = subscription.Id,
                            UserId = record.SubscriptionSettings.UserId
                        };

                        subscription.PaymentStatusType = PaymentStatusType.Pending;

                        _dataContext.Purchases.Update(record);

                        var statisticsEntity = new Core.Domain.Statistics.Statistics
                        {
                            SubscriptionSalesId = subscription.Id,
                            SubscriptionSalesAmount = Convert.ToDouble(subscription.Ref_GrossAmount),
                            DateCounted = DateTime.Now
                        };

                        await _dataContext.Statistics.AddAsync(statisticsEntity);

                        await _dataContext.SaveChangesAsync();

                        response = new SuccessResponse();
                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update purchase record: {ex1}");
                        _logger.Debug($"purchase_subscription.Ref_FirstName={ref_FirstName},purchase_subscription.Ref_LastName={ref_LastName},purchase_subscription.Ref_PayerId={ref_PayerId},purchase_subscription.Ref_DatePaid={ref_DatePaid},purchase_subscription.Ref_NextBillingDate={ref_NextBillingDate},purchase_subscription.Ref_GrossAmount={ref_GrossAmount},purchase_subscription.Ref_Fee={ref_Fee},purchase_subscription.Ref_NetAmount={ref_NetAmount},purchase.PurchaseStatusType={purchaseStatus},purchase.SubscriptionEmailStatusType={emailStatusType} WHERE purchase.Id={id}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                    }
                else
                {
                    _logger.Debug($"Purchase record not found");
                    response = new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }


            return response;

        }

        public static double? GetNetAmount(double? amount, int? percentage)
        {

            double? netAmount;

            if (percentage.HasValue && percentage > 0)
            {
                var charge = amount * percentage / 100;
                netAmount = amount - charge;
            }
            else
            {
                netAmount = amount;
            }

            return Convert.ToDouble(netAmount);

        }

        public long? GetPurchaseCount(PurchaseType purchaseType, long userId, long videoIdWebinarIdSubscriptionSettingsId)
        {

            try
            {

                if (purchaseType == PurchaseType.PayPerView)
                {
                    return _dataContext.Purchases.AsNoTracking()
                                    .Include(e => e.Detail)
                                    .Include(e => e.Coupon)
                                    .Where(p =>
                                                p.UserId == userId &&
                                                p.VideoId == videoIdWebinarIdSubscriptionSettingsId &&
                                                p.PurchaseType == purchaseType &&
                                                p.Detail.Ref_AuthorizationId != null &&
                                                p.Detail.Ref_CaptureId != null &&
                                                p.Coupon.Expired == false)
                                    .LongCount();
                }
                else if (purchaseType == PurchaseType.LiveTicket)
                {
                    return _dataContext.Purchases.AsNoTracking()
                                        .Include(e => e.Detail)
                                        .Where(p =>
                                                    p.UserId == userId &&
                                                    p.WebinarId == videoIdWebinarIdSubscriptionSettingsId &&
                                                    p.PurchaseType == purchaseType &&
                                                    (
                                                        p.PurchaseStatusType == PurchaseStatusType.Captured ||
                                                        p.PurchaseStatusType == PurchaseStatusType.Active
                                                    )
                                                )
                                        .LongCount();
                }

                return _dataContext.Purchases.AsNoTracking()
                                    .Include(e => e.Subscriptions)
                                    .Where(p =>
                                                p.UserId == userId &&
                                                p.SubscriptionSettingsId == videoIdWebinarIdSubscriptionSettingsId &&
                                                p.PurchaseType == purchaseType &&
                                                (
                                                    p.PurchaseStatusType == PurchaseStatusType.Active ||
                                                    p.PurchaseStatusType == PurchaseStatusType.WaitingForPayment
                                                )
                                            )
                                    .LongCount();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from purchase table: {ex}");
                if (purchaseType == PurchaseType.PayPerView)
                {
                    _logger.Debug($"WHERE UserId={userId} AND VideoId={videoIdWebinarIdSubscriptionSettingsId} AND PurchaseType={purchaseType} AND purchase_detail.Ref_AuthorizationId != null AND purchase_detail.Ref_CaptureId != null AND purchase_coupon.Expired=0");
                }
                else if(purchaseType == PurchaseType.LiveTicket)
                {
                    _logger.Debug($"WHERE UserId={userId} AND WebinarId={videoIdWebinarIdSubscriptionSettingsId} AND PurchaseType={purchaseType} AND purchase_detail.Ref_AuthorizationId != null AND purchase_detail.Ref_CaptureId != null");
                }
                else
                {
                    _logger.Debug($"WHERE UserId={userId} AND SubscriptionSettingsId={videoIdWebinarIdSubscriptionSettingsId} AND PurchaseType={purchaseType}");
                }

                return null;
            }

        }

        public long? GetPurchaseCount(PurchaseType purchaseType, PaymentType paymentType, PurchaseStatusType purchaseStatusType, long userId, long videoIdWebinarIdSubscriptionSettingsId)
        {
            try
            {

                if(purchaseType == PurchaseType.PayPerView)
                {
                    return _dataContext.Purchases.AsNoTracking()
                                                    .Include(e => e.Detail)
                                                    .Where(p =>
                                                                p.PurchaseType == purchaseType &&
                                                                p.PaymentType == paymentType &&
                                                                p.PurchaseStatusType == purchaseStatusType &&
                                                                p.UserId == userId &&
                                                                p.VideoId == videoIdWebinarIdSubscriptionSettingsId)
                                                    .LongCount();
                }

                return _dataContext.Purchases.AsNoTracking()
                                                .Include(e => e.Detail)
                                                .Where(p =>
                                                            p.PurchaseType == purchaseType &&
                                                            p.PaymentType == paymentType &&
                                                            p.PurchaseStatusType == purchaseStatusType &&
                                                            p.UserId == userId &&
                                                            p.WebinarId == videoIdWebinarIdSubscriptionSettingsId)
                                                .LongCount();

            }
            catch (Exception ex)
            {
                if (purchaseType == PurchaseType.PayPerView)
                {
                    _logger.Debug($"WHERE PurchaseType={(int)purchaseStatusType} AND " +
                        $"PaymentType={(int)paymentType} AND  PurchaseStatusType={(int)purchaseStatusType} AND " +
                        $"UserId={userId} AND VideoId={videoIdWebinarIdSubscriptionSettingsId}");
                }
                else
                {
                    _logger.Debug($"WHERE PurchaseType={(int)purchaseStatusType} AND " +
                        $"PaymentType={(int)paymentType} AND  PurchaseStatusType={(int)purchaseStatusType} AND " +
                        $"UserId={userId} AND WebinarId={videoIdWebinarIdSubscriptionSettingsId}");
                }

                return null;
            }
        }

        public async Task<BaseResponse> CancelSubscription(long? subscriptionId)
        {

            if (subscriptionId.HasValue == false)
            {
                return new ErrorResponse("SubscriptionId", MessageHelper.Required, ErrorCodes.Required);
            }
            else if (subscriptionId <= 0)
            {
                return new ErrorResponse("SubscriptionId", MessageHelper.Invalid, ErrorCodes.Invalid);
            }
            else
            {
                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user == null)
                {
                    return new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
                }
                else
                {

                    try
                    {

                        var record = await _dataContext.PurchaseSubscriptions
                                            .Include(e => e.Purchase)
                                            .Where(p =>
                                                        p.Id == subscriptionId &&
                                                        p.Purchase.UserId == user.Id &&
                                                        p.Purchase.PurchaseType == PurchaseType.Subscription &&
                                                        p.Purchase.PurchaseStatusType == PurchaseStatusType.Active)
                                            .SingleOrDefaultAsync();

                        if (record == null)
                        {
                            return new ErrorResponse("SubscriptionId", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                        }
                        else
                        {

                            #region Paypal cache
                            var payPalCache = await _cacheService.GetAsync(CacheType.PaypalAccessToken);
                            bool paypalAccessTokenValid = PaypalApiHelper.IsPaypalAccessTokenValid(payPalCache, _logger);
                            #endregion

                            var sysSettings = _settingsService.GetSysSettingsList(SettingsType.PAYPAL);

                            string clientId;
                            string secret;
                            string subscriptionCancelUrl;
                            SysSettingsHelper.GetPaypalClientIdSecretSubscriptionCancelUrl(out clientId, out secret, out subscriptionCancelUrl, sysSettings, _logger);

                            if (clientId.HasValue() && secret.HasValue() && subscriptionCancelUrl.HasValue() && paypalAccessTokenValid)
                            {

                                var paypalHelper = new PaypalApiHelper(_logger, clientId, secret);
                                var response = await paypalHelper.CancelSubscriptionAsync(payPalCache.Value1, subscriptionCancelUrl, record.Ref_SubscriptionId);
                                if (response == false)
                                {
                                    return new ErrorResponse("SubscriptionId", MessageHelper.Paypal_SubscriptionCancelFailed, ErrorCodes.Paypal_SubscriptionCancelFailed);
                                }
                                else
                                {
                                    try
                                    {
                                        record.Purchase.PurchaseStatusType = PurchaseStatusType.Canceled;
                                        _dataContext.PurchaseSubscriptions.Update(record);
                                        await _dataContext.SaveChangesAsync();

                                        return new SuccessResponse();
                                    }
                                    catch (Exception ex1)
                                    {
                                        _logger.Error($"While trying to update purchase record: {ex1}");
                                        _logger.Debug($"PurchaseStatusType={(int)PurchaseStatusType.Canceled} WHERE purchase_subscription.Id={subscriptionId} AND UserId={user.Id} AND PurchaseType={(int)PurchaseType.Subscription} AND PurchaseStatusType={(int)PurchaseStatusType.Active}");
                                        return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);

                                    }

                                }
                            }
                            else
                            {
                                return new ErrorResponse("SubscriptionId", MessageHelper.Paypal_SubscriptionSettingsNotFoundInDb, ErrorCodes.Paypal_SubscriptionSettingsNotFoundInDb);
                            }

                        }

                    }
                    catch (Exception ex)
                    {
                        _logger.Error($"While trying to get record from purchase_subscription table: {ex}");
                        _logger.Debug($"WHERE Id={subscriptionId} AND purchase.UserId={user.Id} AND purchase.PurchaseType={(int)PurchaseType.Subscription} AND purchase.PurchaseStatusType={(int)PurchaseStatusType.Active}");
                        return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }

            }

        }

        public async Task<BaseResponse> LiveTicketSubscriberPurchaseAsync(string liveTicketHash)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if(user == null)
            {
                return new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
            }

            try
            {

                var webinar = _webinarService.GetWebinar(liveTicketHash);
                if(webinar == null || webinar.WebinarStatusType != Core.Domain.Webinar.Enums.WebinarStatusType.ScheduleLive)
                {
                    return new ErrorResponse("LiveTicketHash", MessageHelper.Invalid, ErrorCodes.Invalid);
                }

                List<Core.Domain.CommonType.CommonType> videoTypes = null;

                try
                {
                    videoTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.VideoType);
                }
                catch (Exception ex2)
                {
                    _logger.Error($"While trying to get record from common_type table: {ex2}");
                }

                var entity = new Core.Domain.Purchase.Purchase
                {
                    UserId = user.Id,
                    PurchaseType = PurchaseType.LiveTicket,
                    WebinarId = webinar.Id,
                    PurchaseStatusType = PurchaseStatusType.Active,
                    Active = true,
                    PaymentStatusType = PaymentStatusType.Success,
                    SubscriptionEmailStatusType = SubscriptionEmailStatusType.None,
                    Detail = new Core.Domain.Purchase.PurchaseDetail
                    {
                        Ref_OrderId = Convert.ToString(user.Id),
                        Ref_AuthorizationId = Convert.ToString(user.Id),
                        Ref_PayerId = Convert.ToString(user.Id),
                        Ref_CaptureId = Convert.ToString(user.Id),
                        Ref_GrossAmount = 0,
                        Ref_Fee = 0,
                        Ref_NetAmount = 0,
                        NetAmount = 0
                    },
                    Sales = new Core.Domain.Sales.Sales
                    {
                        UserId = webinar.CreatedBy
                    }
                };

                webinar.LiveTicketRemaining = webinar.LiveTicketRemaining - 1;

                _dataContext.Webinars.Update(webinar);

                _dataContext.Purchases.Add(entity);

                await _dataContext.SaveChangesAsync();

                return new SuccessResponse(
                                            new
                                            {
                                                webinar.LiveName,
                                                WebinarStart = webinar.WebinarStart.ToString("yyyy/MM/dd HH:mm"),
                                                webinar.Agenda,
                                                Category = _commonTypeService.GetCommonTypeName(videoTypes, (int)webinar.VideoType, true),
                                                CategoryEn = _commonTypeService.GetCommonTypeName(videoTypes, (int)webinar.VideoType, false),
                                                Performer = webinar.Performers.Select(q => new { q.Name }).ToList(),
                                                ZoomUrl = webinar.WebinarZoom.Zoom_join_url,
                                                Thumbnail = string.Format(_imageSettings.ServerUrl, webinar.Hash),
                                                webinar.CreatedByUser.Username,
                                            });

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to purchase table: {ex}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

    }
}
