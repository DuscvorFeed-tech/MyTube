using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Caches.Enums;
using MyTube.Core.Domain.Purchase;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Domain.Video;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.Caches;
using MyTube.Services.CommonType;
using MyTube.Services.Helpers.Key;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Paypal;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.Purchase;

namespace MyTube.Services.Paypal
{
    public class PaypalService : IPaypalService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private PaypalSettings_v2 _paypalSettings;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IPurchaseService _orderService;
        private readonly AppSettings _appSettings;
        private readonly IPurchaseCouponService _couponService;
        private readonly ICommonTypeService _commonTypeService;
        private ImageSettings_v2 _imageSettings;
        private readonly ICacheService _cacheService;
        private List<Core.Domain.SysSettings.SysSettings> _sysSettings;

        #endregion

        #region Constructor

        public PaypalService(DataContext dataContext, IWeRaveYouLog logger,
                                IHttpContextAccessor contextAccessor, 
                                IPurchaseService orderService, IOptions<AppSettings> appSettings,
                                IPurchaseCouponService couponService, ICommonTypeService commonTypeService,
                                ICacheService cacheService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _contextAccessor = contextAccessor;
            _orderService = orderService;
            _appSettings = appSettings.Value;
            _couponService = couponService;
            _commonTypeService = commonTypeService;
            _cacheService = cacheService;

            SetSysSettings();

        }

        #endregion

        public void SetSysSettings()
        {

            try
            {

                _sysSettings = _dataContext.SysSettings.AsNoTracking().ToList();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from sys_settings table: {ex}");
            }

            _paypalSettings = SysSettingsHelper.GetPaypalSettings(_sysSettings, _logger);
            _imageSettings = SysSettingsHelper.GetImageSettings(_sysSettings, _logger);

        }

        public async Task<BaseResponse> InsertPurchaseAsync(PurchaseType purchaseType, PaymentType paymentType, string hash, string returnUrl, string cancelUrl)
        {

            BaseResponse response = null;

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {

                #region Paypal cache
                var payPalCache = await _cacheService.GetAsync(CacheType.PaypalAccessToken);
                bool paypalAccessTokenValid = PaypalApiHelper.IsPaypalAccessTokenValid(payPalCache, _logger);
                #endregion

                long videoId, webinarId, subscriptionSettingsId;
                double? price;
                string planId;

                GetPrice(purchaseType, user.Id, hash, out videoId, out webinarId, out planId, out subscriptionSettingsId, out price);

                if (price != null && price > 0 && paypalAccessTokenValid)
                {

                    var paypalHelper = new PaypalApiHelper(_logger, _paypalSettings.ClientId, _paypalSettings.Secret);

                    if (purchaseType == PurchaseType.Subscription)
                    {
                        var createSubscriptionResponse = await paypalHelper.CreateSubscriptionAsync(payPalCache.Value1, _paypalSettings.GetCreateSubscriptionUrl, planId, user.Email, returnUrl, cancelUrl);
                        if(createSubscriptionResponse != null)
                        {
                            if(createSubscriptionResponse.links.Length > 0)
                            {
                                var link = createSubscriptionResponse.links.Where(p => p.rel.ToLower() == "approve").FirstOrDefault();
                                if (link != null)
                                {

                                    var purchaseEntity = new Core.Domain.Purchase.Purchase
                                    {
                                        UserId = user.Id,
                                        PurchaseType = purchaseType,
                                        PaymentType = paymentType,
                                        Subscriptions = new List<PurchaseSubscription> {
                                            new PurchaseSubscription
                                            {
                                                Ref_SubscriptionId = createSubscriptionResponse.id,
                                                Ref_SubscriptionUrl = link.href,
                                                Billed = false
                                            }
                                        },
                                        SubscriptionEmailStatusType = SubscriptionEmailStatusType.None,
                                        PurchaseStatusType = PurchaseStatusType.Created,
                                        Active = true
                                    };

                                    purchaseEntity.SubscriptionSettingsId = subscriptionSettingsId;


                                    var payperviewInsResp = await _orderService.InsertPurchaseAsync(purchaseEntity);
                                    if (payperviewInsResp.Success == true)
                                    {
                                        response = new SuccessResponse(new 
                                        { 
                                            subscriptionId = createSubscriptionResponse.id, 
                                            url = link.href
                                        });
                                    }
                                    else
                                    {
                                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                                    }
                                }
                                else
                                {
                                    response = new ErrorResponse("PaypalSubscriptionUrl", MessageHelper.Paypal_SubscriptionUrlNotFound, ErrorCodes.Paypal_SubscriptionUrlNotFound);
                                    _logger.Debug($"WHERE PaypalOrderLinks={createSubscriptionResponse.links}");
                                }
                            }
                            else
                            {
                                response = new ErrorResponse("PaypalOrderUrl", MessageHelper.Paypal_FailedGettingSubscriptionUrl, ErrorCodes.Paypal_FailedGettingSubscriptionUrl);
                            }
                        }
                        else
                        {
                            response = new ErrorResponse("PaypalOrder", MessageHelper.Paypal_FailedCreatingSubscription, ErrorCodes.Paypal_FailedCreatingSubscription);
                        }
                    }
                    else
                    {
                        var createOrderResponse = await paypalHelper.CreateOrderAsync(payPalCache.Value1, _paypalSettings.GetCreateOrderUrl, returnUrl, cancelUrl, Convert.ToString(price), _paypalSettings.Currency);
                        if (createOrderResponse != null)
                        {
                            if (createOrderResponse.links.Length > 0)
                            {

                                var link = createOrderResponse.links.Where(p => p.rel.ToLower() == "approve").FirstOrDefault();
                                if (link != null)
                                {

                                    var purchaseEntity = new Core.Domain.Purchase.Purchase
                                    {
                                        UserId = user.Id,
                                        PurchaseType = purchaseType,
                                        PaymentType = paymentType,
                                        SubscriptionEmailStatusType = SubscriptionEmailStatusType.None,
                                        Detail = new PurchaseDetail
                                        {
                                            Ref_OrderId = createOrderResponse.id,
                                            Ref_OrderUrl = link.href
                                        },
                                        PurchaseStatusType = PurchaseStatusType.Created,
                                        Active = true
                                    };

                                    if (purchaseType == PurchaseType.PayPerView)
                                    {
                                        purchaseEntity.VideoId = videoId;
                                    }
                                    else if (purchaseType == PurchaseType.LiveTicket)
                                    {
                                        purchaseEntity.WebinarId = webinarId;
                                    }

                                    var payperviewInsResp = await _orderService.InsertPurchaseAsync(purchaseEntity);
                                    if (payperviewInsResp.Success == true)
                                    {
                                        response = new SuccessResponse(new { orderId = purchaseEntity.Detail.Ref_OrderId, url = purchaseEntity.Detail.Ref_OrderUrl });
                                    }
                                    else
                                    {
                                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                                    }
                                }
                                else
                                {
                                    response = new ErrorResponse("PaypalOrderUrl", MessageHelper.Paypal_PayperviewOrderUrlNotFound, ErrorCodes.Paypal_PayperviewOrderUrlNotFound);
                                    _logger.Debug($"WHERE PaypalOrderLinks={createOrderResponse.links}");
                                }

                            }
                            else
                            {
                                if (purchaseType == PurchaseType.PayPerView)
                                {
                                    response = new ErrorResponse("PaypalOrderUrl", MessageHelper.Paypal_FailedGettingPayperviewOrderUrl, ErrorCodes.Paypal_FailedGettingPayperviewOrderUrl);
                                }
                                else
                                {
                                    response = new ErrorResponse("PaypalOrderUrl", MessageHelper.Paypal_FailedGettingLiveTicketOrderUrl, ErrorCodes.Paypal_FailedGettingLiveTicketOrderUrl);
                                }
                            }
                        }
                        else
                        {
                            if (purchaseType == PurchaseType.PayPerView)
                            {
                                response = new ErrorResponse("PaypalOrder", MessageHelper.Paypal_FailedCreatingPayperviewOrder, ErrorCodes.Paypal_FailedCreatingPayperviewOrder);
                            }
                            else
                            {
                                response = new ErrorResponse("PaypalOrder", MessageHelper.Paypal_FailedCreatingLiveTicketOrder, ErrorCodes.Paypal_FailedCreatingLiveTicketOrder);
                            }
                        }
                    }
                }
                else
                {
                    if (purchaseType == PurchaseType.LiveTicket)
                    {
                        response = new ErrorResponse("LiveTicketHash", MessageHelper.LiveTicketsSold, ErrorCodes.LiveTicketsSold);
                    }
                    else
                    {
                        response = new ErrorResponse("PaidContentHash", MessageHelper.Invalid, ErrorCodes.Invalid);
                    }
                }

            }
            else
            {
                _logger.Debug($"Cannot get user information from HttpContext: {_contextAccessor}");
                response = new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
            }

            return response;

        }

        private void GetPrice(PurchaseType purchaseType, long userId, string hashOrUsername, out long videoId, out long webinarId, out string planId, out long subscriptionSettingsId, out double? paidContentPrice)
        {

            videoId = 0;
            webinarId = 0;
            subscriptionSettingsId = 0;
            planId = null;
            paidContentPrice = null;

            try
            {

                if(purchaseType == PurchaseType.PayPerView)
                {

                    var record = _dataContext.Videos.AsNoTracking()
                                        .Where(p =>
                                                    p.UserId != userId &&
                                                    p.PaidContent == true &&
                                                    p.PaidContentHash == hashOrUsername)
                                        .SingleOrDefault();

                    if (record != null)
                    {
                        videoId = record.Id;
                        paidContentPrice = record.PaidContentPrice;
                    }

                }
                else if(purchaseType == PurchaseType.LiveTicket)
                {

                    var record = _dataContext.Webinars.AsNoTracking()
                                        .Where(p =>
                                                    p.CreatedBy != userId &&
                                                    p.LiveTicket == true &&
                                                    p.LiveTicketHash == hashOrUsername &&
                                                    p.LiveTicketRemaining > 0)
                                        .SingleOrDefault();

                    if(record != null)
                    {
                        webinarId = record.Id;
                        paidContentPrice = record.LiveTicketPrice;
                    }

                }
                else if(purchaseType == PurchaseType.Subscription)
                {

                    var record = _dataContext.Users.AsNoTracking()
                                        .Include(e => e.SubscriptionSettings)
                                        .Where(p =>
                                                    p.Username.ToLower() == hashOrUsername.ToLower() &&
                                                    p.UserStatusType == Core.Domain.User.Enums.UserStatusType.Active &&
                                                    p.UserType == Core.Domain.User.Enums.UserType.Creator &&
                                                    p.Subscription == true &&
                                                    p.SubscriptionSettings.SubscriptionSettingsType == Core.Domain.SubscriptionSettings.Enums.SubscriptionSettingsType.Active &&
                                                    p.SubscriptionSettings.Ref_PlanId != null)
                                        .SingleOrDefault();

                    if (record != null)
                    {
                        planId = record.SubscriptionSettings.Ref_PlanId;
                        subscriptionSettingsId = record.SubscriptionSettings.Id;
                        paidContentPrice = record.SubscriptionSettings.Amount;
                    }
                }

            }
            catch (Exception ex)
            {

                if(purchaseType == PurchaseType.PayPerView)
                {
                    _logger.Error($"While trying to get record from video table: {ex}");
                    _logger.Debug($"WHERE UserId != {userId} AND PaidContent=1 AND PaidContentHash={hashOrUsername}");
                }
                else if(purchaseType == PurchaseType.LiveTicket)
                {
                    _logger.Error($"While trying to get record from webinar table: {ex}");
                    _logger.Debug($"WHERE CreatedBy != {userId} AND LiveTicket=1 AND LiveTicket=1 AND LiveTicketHash={hashOrUsername}");
                }

            }

        }

        public async Task<BaseResponse> UpdatePurchaseAsync(PurchaseType purchaseType, string ref_OrderIdSubscriptionId)
        {

            BaseResponse response = null;

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {

                try
                {

                    Core.Domain.Purchase.Purchase purchase = null;

                    if(purchaseType == PurchaseType.PayPerView)
                    {
                        purchase = await _dataContext.Purchases
                                                        .Include(e => e.Detail)
                                                        .Include(e => e.Video)
                                                            .ThenInclude(e => e.User)
                                                                .ThenInclude(e => e.ProfitPercentage)
                                                        .Include(e => e.Video)
                                                            .ThenInclude(e => e.Thumbnail)
                                                        .Where(p =>
                                                                    p.UserId == user.Id &&
                                                                    p.PurchaseType == purchaseType &&
                                                                    p.Detail.Ref_OrderId == ref_OrderIdSubscriptionId &&
                                                                    p.PurchaseStatusType == PurchaseStatusType.Created &&
                                                                    p.Active == true)
                                                        .SingleOrDefaultAsync();
                    }
                    else if(purchaseType == PurchaseType.LiveTicket)
                    {
                        purchase = await _dataContext.Purchases
                                                        .Include(e => e.Detail)
                                                        .Include(e => e.Webinar)
                                                            .ThenInclude(e => e.WebinarZoom)
                                                        .Include(e => e.Webinar)
                                                            .ThenInclude(e => e.CreatedByUser)
                                                                .ThenInclude(e => e.ProfitPercentage)
                                                        .Include(e => e.Webinar)
                                                            .ThenInclude(e => e.Performers)
                                                        .Where(p =>
                                                                    p.UserId == user.Id &&
                                                                    p.PurchaseType == purchaseType &&
                                                                    p.Detail.Ref_OrderId == ref_OrderIdSubscriptionId &&
                                                                    p.PurchaseStatusType == PurchaseStatusType.Created &&
                                                                    p.Active == true &&
                                                                    p.Webinar.LiveTicketRemaining > 0)
                                                        .SingleOrDefaultAsync();
                    }
                    else if(purchaseType == PurchaseType.Subscription)
                    {
                        var subscription = await _dataContext.PurchaseSubscriptions
                                                    .Include(e => e.Purchase)
                                                        .ThenInclude(e => e.Subscriptions)
                                                    .Include(e => e.Purchase)
                                                        .ThenInclude(e => e.SubscriptionSettings)
                                                            .ThenInclude(e => e.User)
                                                    .Where(p =>
                                                                p.Ref_SubscriptionId == ref_OrderIdSubscriptionId &&
                                                                p.Purchase.UserId == user.Id &&
                                                                p.Purchase.PurchaseType == purchaseType &&
                                                                p.Purchase.PurchaseStatusType == PurchaseStatusType.Created &&
                                                                p.Purchase.Active == true)
                                                    .SingleOrDefaultAsync();

                        if (subscription != null)
                        {
                            purchase = subscription.Purchase;
                        }

                    }


                    if (purchase != null)
                    {

                        List<Core.Domain.CommonType.CommonType> videoTypes = null;

                        try
                        {
                            videoTypes = _commonTypeService.GetCommonTypeList(Core.Domain.CommonType.CommonTypeList.VideoType);
                        }
                        catch (Exception ex2)
                        {
                            _logger.Error($"While trying to get record from common_type table: {ex2}");
                        }

                        #region Paypal cache
                        var payPalCache = await _cacheService.GetAsync(CacheType.PaypalAccessToken);
                        bool paypalAccessTokenValid = PaypalApiHelper.IsPaypalAccessTokenValid(payPalCache, _logger);
                        #endregion

                        var paypalHelper = new PaypalApiHelper(_logger, _paypalSettings.ClientId, _paypalSettings.Secret);

                        if (purchaseType == PurchaseType.Subscription)
                        {
                            var getSusbcriptionDetailsResponse = await paypalHelper.GetSubscriptionDetails(payPalCache.Value1, _paypalSettings.GetSubscriptionDetailsUrl, ref_OrderIdSubscriptionId);
                            if(getSusbcriptionDetailsResponse != null)
                            {
                                if (getSusbcriptionDetailsResponse.status.ToLower() == "active")
                                {

                                    SetSubscriptionInfo(purchase, getSusbcriptionDetailsResponse);

                                    try
                                    {
                                        _dataContext.Purchases.Update(purchase);
                                        await _dataContext.SaveChangesAsync();

                                        response = new SuccessResponse(
                                                        new
                                                        {
                                                            Artist = purchase.SubscriptionSettings.User.Username,
                                                            Amount = string.Format("{0}{1}", _paypalSettings.Currency, purchase.SubscriptionSettings.Amount.ToString("N", CultureInfo.InvariantCulture)),
                                                            ArtistProfileUrl = SysSettingsHelper.GetArtistOrUserProfileUrl(purchase.SubscriptionSettings.User.Username, Core.Domain.User.Enums.UserType.Creator, _sysSettings, _logger),
                                                        });

                                    }
                                    catch (Exception ex1)
                                    {
                                        _logger.Error($"While trying to save record to purchase table: {ex1}");
                                        _logger.Debug($"Purchase={purchase}");
                                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                                    }

                                }
                                else if (getSusbcriptionDetailsResponse.status.ToLower() == "approval_pending")
                                {
                                    response = new ErrorResponse("PaypalSubscriptionPayment", MessageHelper.Paypal_SubscriptionPaymentApprovalPending, ErrorCodes.Paypal_SubscriptionPaymentApprovalPending);
                                }
                                else
                                {
                                    response = new ErrorResponse("PaypalSubscriptionPayment", MessageHelper.Paypal_SubscriptionStatusUnknown, ErrorCodes.Paypal_SubscriptionStatusUnknown);
                                }
                            }
                            else
                            {
                                response = new ErrorResponse("PaypalSubscription", MessageHelper.Paypal_FailedGettingSubscriptionDetails, ErrorCodes.Paypal_FailedGettingSubscriptionDetails);
                            }
                        }
                        else
                        {
                            var authorizeOrderPaymentResponse = await paypalHelper.AuthorizeOrderPaymentAsync(payPalCache.Value1, _paypalSettings.GetAuthorizeOrderPaymentUrl, ref_OrderIdSubscriptionId);
                            if (authorizeOrderPaymentResponse != null)
                            {
                                if (authorizeOrderPaymentResponse.status.ToLower() == "completed")
                                {

                                    SetAuthorizationInfo(purchase, authorizeOrderPaymentResponse);

                                    if (purchase.Detail.Ref_AuthorizationId.HasValue())
                                    {

                                        var captureOrderPaymentResponse = await paypalHelper.CaptureOrderPaymentAsync(payPalCache.Value1, _paypalSettings.GetCaptureOrderPaymentUrl, purchase.Detail.Ref_AuthorizationId);
                                        if (captureOrderPaymentResponse != null)
                                        {

                                            if (captureOrderPaymentResponse.status.ToLower() == "completed")
                                            {

                                                SetPaymentInfo(purchase, captureOrderPaymentResponse);

                                                if (purchase.Detail.Ref_CaptureId.HasValue())
                                                {

                                                    if (purchase.Detail.Ref_GrossAmount.HasValue == false ||
                                                        purchase.Detail.Ref_Fee.HasValue == false ||
                                                        purchase.Detail.Ref_NetAmount.HasValue == false)
                                                    {
                                                        _logger.Debug($"Ref_GrossAmount={purchase.Detail.Ref_GrossAmount} Ref_Fee={purchase.Detail.Ref_Fee} Ref_NetAmount={purchase.Detail.Ref_NetAmount}");
                                                        response = new ErrorResponse("PaypalOrderPayment", MessageHelper.Paypal_OrderPaymentPaymentInfoIncomplete, ErrorCodes.Paypal_OrderPaymentPaymentInfoIncomplete);
                                                    }
                                                    else
                                                    {

                                                        if(purchaseType == PurchaseType.PayPerView)
                                                        {
                                                            var coupon = GenerateCouponCode(purchase.Id);

                                                            purchase.Coupon = new Core.Domain.Purchase.PurchaseCoupon
                                                            {
                                                                CouponCode = coupon,
                                                                Active = false
                                                            };

                                                            purchase.Sales = new Core.Domain.Sales.Sales
                                                            {
                                                                UserId = purchase.Video.UserId,
                                                                PurchaseId = purchase.Id
                                                            };

                                                        }
                                                        else if(purchaseType == PurchaseType.LiveTicket)
                                                        {
                                                            purchase.Webinar.LiveTicketRemaining = purchase.Webinar.LiveTicketRemaining - 1;

                                                            purchase.Sales = new Core.Domain.Sales.Sales
                                                            {
                                                                UserId = purchase.Webinar.CreatedBy,
                                                                PurchaseId = purchase.Id
                                                            };

                                                        }

                                                        purchase.PurchaseStatusType = PurchaseStatusType.Captured;
                                                        purchase.PaymentStatusType = PaymentStatusType.Pending;

                                                        purchase.Detail.NetAmount = PurchaseService.GetNetAmount(purchase.Detail.Ref_NetAmount, purchaseType == PurchaseType.PayPerView ? purchase.Video.User.ProfitPercentage.PayPerView : purchase.Webinar.CreatedByUser.ProfitPercentage.LiveTicket);

                                                        try
                                                        {
                                                            _dataContext.Purchases.Update(purchase);

                                                            var statisticsEntity = new Core.Domain.Statistics.Statistics
                                                            {
                                                                DateCounted = DateTime.Now
                                                            };

                                                            if(purchaseType == PurchaseType.PayPerView)
                                                            {
                                                                statisticsEntity.PayPerViewSalesId = purchase.Id;
                                                                statisticsEntity.PayPerViewSalesAmount = Convert.ToDouble(purchase.Detail.Ref_GrossAmount);
                                                            }
                                                            else if(purchaseType == PurchaseType.LiveTicket)
                                                            {
                                                                statisticsEntity.LiveTicketSalesId = purchase.Id;
                                                                statisticsEntity.LiveTicketSalesAmount = Convert.ToDouble(purchase.Detail.Ref_GrossAmount);
                                                            }

                                                            await _dataContext.Statistics.AddAsync(statisticsEntity);

                                                            await _dataContext.SaveChangesAsync();

                                                            if(purchaseType == PurchaseType.PayPerView)
                                                            {
                                                                response = new SuccessResponse(
                                                                                        new 
                                                                                        {  
                                                                                            purchase.Video.Title, 
                                                                                            purchase.Video.Description,
                                                                                            Category = GetCommonTypeStatus(videoTypes, (int)purchase.Video.VideoType, false),
                                                                                            CategoryEn = GetCommonTypeStatus(videoTypes, (int)purchase.Video.VideoType, true),
                                                                                            purchase.Video.Hash,
                                                                                            VideoThumbnailUrl = GetVideoThumbnailUrl(_imageSettings.ServerUrl, purchase.Video.Thumbnail),
                                                                                            CouponCode = purchase.Coupon.CouponCode,
                                                                                            purchase.Video.User.Username,
                                                                                        });
                                                            }
                                                            else if(purchaseType == PurchaseType.LiveTicket)
                                                            {
                                                                response = new SuccessResponse(
                                                                                    new 
                                                                                    { 
                                                                                        purchase.Webinar.LiveName,
                                                                                        WebinarStart = purchase.Webinar.WebinarStart.ToString("yyyy/MM/dd HH:mm"),
                                                                                        purchase.Webinar.Agenda,
                                                                                        Category = GetCommonTypeStatus(videoTypes, (int)purchase.Webinar.VideoType, false),
                                                                                        CategoryEn = GetCommonTypeStatus(videoTypes, (int)purchase.Webinar.VideoType, true),
                                                                                        Performer = purchase.Webinar.Performers.Select(q => new { q.Name }).ToList(),
                                                                                        ZoomUrl = purchase.Webinar.WebinarZoom.Zoom_join_url,
                                                                                        Thumbnail = string.Format(_imageSettings.ServerUrl, purchase.Webinar.Hash),
                                                                                        purchase.Webinar.CreatedByUser.Username,
                                                                                    });
                                                            }
                                                        }
                                                        catch (Exception ex1)
                                                        {
                                                            _logger.Error($"While trying to save record to purchase table: {ex1}");
                                                            _logger.Debug($"Purchase={purchase}");
                                                            response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                                                        }
                                                    }
                                                }
                                                else
                                                {
                                                    response = new ErrorResponse("PaypalOrderPayment", MessageHelper.Paypal_OrderPaymentCaptureIdNotFound, ErrorCodes.Paypal_OrderPaymentCaptureIdNotFound);
                                                }

                                            }
                                            else
                                            {
                                                response = new ErrorResponse("PaypalOrderPayment", MessageHelper.Paypal_CaptureOrderPaymentStatusUnknown, ErrorCodes.Paypal_CaptureOrderPaymentStatusUnknown);
                                            }

                                        }
                                        else
                                        {
                                            response = new ErrorResponse("PaypalOrderPayment", MessageHelper.Paypal_FailedCapturingOrderPayment, ErrorCodes.Paypal_FailedCapturingOrderPayment);
                                        }

                                    }
                                    else
                                    {
                                        response = new ErrorResponse("PaypalOrderPayment", MessageHelper.Paypal_OrderPaymentAuthorizationIdNotFound, ErrorCodes.Paypal_OrderPaymentAuthorizationIdNotFound);
                                    }

                                }
                                else
                                {
                                    response = new ErrorResponse("PaypalOrderPayment", MessageHelper.Paypal_OrderPaymentAuthorizationStatusUnknown, ErrorCodes.Paypal_OrderPaymentAuthorizationStatusUnknown);
                                }
                            }
                            else
                            {
                                response = new ErrorResponse("PaypalOrderPayment", MessageHelper.Paypal_FailedOrderPaymentAuthorization, ErrorCodes.Paypal_FailedOrderPaymentAuthorization);
                            }
                        }
                    }
                    else
                    {
                        if (purchaseType == PurchaseType.LiveTicket)
                        {
                            response = new ErrorResponse("LiveTicketHash", MessageHelper.LiveTicketsSold, ErrorCodes.LiveTicketsSold);
                        }
                        else
                        {
                            response = new ErrorResponse("PurchaseId", MessageHelper.Invalid, ErrorCodes.Invalid);
                        }
                    }


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from paypal_payperview_order table: {ex}");
                    _logger.Debug($"WHERE purchase.UserId={user.Id} AND purchase_detail.Ref_OrderId={ref_OrderIdSubscriptionId} AND purchase.OrderStatusType={PurchaseStatusType.Created} AND purchase.Active=1");
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

        private static string GetCommonTypeStatus(List<Core.Domain.CommonType.CommonType> list, int status, bool englishName)
        {
            string response = "";

            if (list != null && list.LongCount() > 0)
            {

                var vidType = list.Where(p => p.Value == status).SingleOrDefault();
                if (vidType != null)
                {
                    response = englishName == false ? vidType.Name : vidType.NameEn;
                }

            }

            return response;
        }

        private static string GetVideoThumbnailUrl(string imageServerUrl, VideoThumbnail thumbnail)
        {
            if (thumbnail != null)
            {

                return string.Format(imageServerUrl, thumbnail.Thumbnail);

            }

            return null;

        }

        private string GenerateCouponCode(long purchaseId)
        {
            string coupon = null;

            while (true)
            {

                coupon = KeyHelper.Generate(_appSettings.PayPerViewCouponCodeLength);

                var count = _couponService.GetPurchaseCouponCount(purchaseId, coupon);
                if (count == 0)
                {
                    break;
                }

            }

            return coupon;

        }

        public static void SetSubscriptionInfo(Core.Domain.Purchase.Purchase purchase, Helpers.Paypal.Response.PaypalGetSubscriptionDetailsResponse getSusbcriptionDetailsResponse, bool setSubscriptionDataOnly = false)
        {


            PurchaseSubscription subscription = null;


            if (purchase.Subscriptions.LongCount() > 0)
            {
                subscription = purchase.Subscriptions.FirstOrDefault();



                if (setSubscriptionDataOnly == false)
                {
                    purchase.Ref_SubscriptionStart = getSusbcriptionDetailsResponse.start_time;
                }

                if (getSusbcriptionDetailsResponse.billing_info != null)
                {

                    if (getSusbcriptionDetailsResponse.billing_info.last_payment != null)
                    {

                        if (getSusbcriptionDetailsResponse.subscriber != null)
                        {
                            if (getSusbcriptionDetailsResponse.subscriber.name != null)
                            {

                                if (getSusbcriptionDetailsResponse.subscriber.name.given_name.HasValue())
                                {
                                    subscription.Ref_FirstName = getSusbcriptionDetailsResponse.subscriber.name.given_name;
                                }

                                if (getSusbcriptionDetailsResponse.subscriber.name.surname.HasValue())
                                {
                                    subscription.Ref_LastName = getSusbcriptionDetailsResponse.subscriber.name.surname;
                                }
                            }

                            if (getSusbcriptionDetailsResponse.subscriber.payer_id.HasValue())
                            {
                                subscription.Ref_PayerId = getSusbcriptionDetailsResponse.subscriber.payer_id;
                            }

                        }

                        if (getSusbcriptionDetailsResponse.billing_info.last_payment.amount != null)
                        {
                            subscription.Ref_GrossAmount = Convert.ToDouble(getSusbcriptionDetailsResponse.billing_info.last_payment.amount.value);
                        }

                        if (getSusbcriptionDetailsResponse.billing_info.last_payment.time.HasValue())
                        {
                            subscription.Ref_DatePaid = Convert.ToDateTime(getSusbcriptionDetailsResponse.billing_info.last_payment.time);
                        }

                        if (getSusbcriptionDetailsResponse.billing_info.next_billing_time.HasValue())
                        {
                            subscription.Ref_NextBillingDate = Convert.ToDateTime(getSusbcriptionDetailsResponse.billing_info.next_billing_time);
                        }

                    }

                }

                if (setSubscriptionDataOnly == false)
                {
                    purchase.PurchaseStatusType = PurchaseStatusType.WaitingForPayment;
                    purchase.SubscriptionEmailStatusType = SubscriptionEmailStatusType.ForSendingWaitingPaymentEmail;
                }

            }

        }

        private static void SetAuthorizationInfo(Core.Domain.Purchase.Purchase purchase, Helpers.Paypal.Response.PaypalAuthorizeOrderPaymentResponse authorizeOrderPaymentResponse)
        {

            if (authorizeOrderPaymentResponse.purchase_units.Length > 0)
            {
                var purchaseUnit = authorizeOrderPaymentResponse.purchase_units.FirstOrDefault();
                if (purchaseUnit != null)
                {
                    if (purchaseUnit.payments.authorizations.Length > 0)
                    {
                        var payment = purchaseUnit.payments.authorizations.FirstOrDefault();
                        if (payment != null)
                        {
                            purchase.Detail.Ref_AuthorizationId = payment.id;
                        }
                    }
                }
            }

            if (authorizeOrderPaymentResponse.payer != null)
            {

                if (authorizeOrderPaymentResponse.payer.payer_id.HasValue())
                {
                    purchase.Detail.Ref_PayerId = authorizeOrderPaymentResponse.payer.payer_id;
                }

                if (authorizeOrderPaymentResponse.payer.name != null)
                {
                    if (authorizeOrderPaymentResponse.payer.name.given_name.HasValue())
                    {
                        purchase.Detail.Ref_FirstName = authorizeOrderPaymentResponse.payer.name.given_name;
                    }

                    if (authorizeOrderPaymentResponse.payer.name.surname.HasValue())
                    {
                        purchase.Detail.Ref_LastName = authorizeOrderPaymentResponse.payer.name.surname;
                    }
                }
            }
        }


        private static void SetPaymentInfo(Core.Domain.Purchase.Purchase purchase, Helpers.Paypal.Response.PaypalCaptureOrderPaymentResponse captureOrderPaymentResponse)
        {

            purchase.Detail.Ref_CaptureId = captureOrderPaymentResponse.id;

            if (captureOrderPaymentResponse.seller_receivable_breakdown != null)
            {

                if (captureOrderPaymentResponse.seller_receivable_breakdown.gross_amount != null)
                {
                    purchase.Detail.Ref_GrossAmount = Convert.ToDouble(captureOrderPaymentResponse.seller_receivable_breakdown.gross_amount.value);
                }

                if (captureOrderPaymentResponse.seller_receivable_breakdown.net_amount != null)
                {
                    purchase.Detail.Ref_NetAmount = Convert.ToDouble(captureOrderPaymentResponse.seller_receivable_breakdown.net_amount.value);
                }

                if (captureOrderPaymentResponse.seller_receivable_breakdown.paypal_fee != null)
                {
                    purchase.Detail.Ref_Fee = Convert.ToDouble(captureOrderPaymentResponse.seller_receivable_breakdown.paypal_fee.value);
                }

            }
        }

    }
}
