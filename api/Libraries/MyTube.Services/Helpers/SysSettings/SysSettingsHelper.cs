using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Core.Domain.User;
using MyTube.Core.Domain.User.Enums;
using MyTube.Services.Helpers.Filter;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Settings;

namespace MyTube.Services.Helpers.SysSettings
{
    public static class SysSettingsHelper
    {

        public static void SetPagerDefaultIfSetValuesAreNotValid(FilterHelperAdmin filter, List<Core.Domain.SysSettings.SysSettings> sysSettings, Logging.IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                try
                {

                    var pageSizeDefault = sysSettings
                                            .Where(p =>
                                                        p.Settings == SettingsType.PAGER_ADMIN.ToString() &&
                                                        p.Name == NameType.PAGE_SIZE_DEFAULT.ToString())
                                            .SingleOrDefault();

                    if (pageSizeDefault == null)
                    {
                        logger.Error($"No record found on sys_settings table");
                        logger.Debug($"WHERE Settings={SettingsType.PAGER_ADMIN} AND Name={NameType.PAGE_SIZE_DEFAULT}");
                    }

                    var pageSizeMaximum = sysSettings
                                            .Where(p =>
                                                        p.Settings == SettingsType.PAGER_ADMIN.ToString() &&
                                                        p.Name == NameType.PAGE_SIZE_MAXIMUM.ToString())
                                            .SingleOrDefault();

                    if (filter.PageSize <= 0)
                    {
                        filter.PageSize = pageSizeDefault != null ? Convert.ToInt32(pageSizeDefault.Value) : 10;
                    }

                    if (pageSizeMaximum != null)
                    {
                        if (filter.PageSize > Convert.ToInt32(pageSizeMaximum.Value))
                        {
                            filter.PageSize = Convert.ToInt32(pageSizeMaximum.Value);
                        }
                    }
                    else
                    {
                        logger.Error($"No record found on sys_settings table");
                        logger.Debug($"WHERE Settings={SettingsType.PAGER_ADMIN} AND Name={NameType.PAGE_SIZE_MAXIMUM}");
                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.PAGER_ADMIN} AND Name={NameType.PAGE_SIZE_DEFAULT} OR Name={NameType.PAGE_SIZE_MAXIMUM}");
                }

            }

        }

        public static string GetPaypalSenderBatchId(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {
            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var requiredSettings = new string[]
                                        {
                                                NameType.SENDER_BATCH_ID.ToString(),
                                        };

                try
                {

                    var settings = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.PAYPAL.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (settings == null || settings.LongCount() == 0)
                    {
                        logger.Error($"PAYPAL SenderBatchHeader required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (settings.LongCount() != 1)
                    {
                        logger.Error($"PAYPAL SenderBatchHeader required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {
                        var senderBatchId = settings.Where(p => p.Name == NameType.SENDER_BATCH_ID.ToString()).SingleOrDefault();

                        return senderBatchId.Value;
                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }

            return null;

        }

        public static PaypalSettings_v2 GetPaypalSettings(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var settings = new PaypalSettings_v2();

                var requiredSettings = new string[]
                                        {
                                                NameType.AUTHORIZE_ORDER_PAYMENT_ROUTE.ToString(),
                                                NameType.BILLING_PLANS_ROUTE.ToString(),
                                                NameType.CAPTURE_ORDERPAYMENT_ROUTE.ToString(),
                                                NameType.CATALOGS_PRODUCTS_ROUTE.ToString(),
                                                NameType.CLIENT_ID.ToString(),
                                                NameType.CREATE_ORDER_ROUTE.ToString(),
                                                NameType.CREATE_SUBSCRIPTION_ROUTE.ToString(),
                                                NameType.CURRENCY.ToString(),
                                                NameType.GENERATE_TOKEN_ROUTE.ToString(),
                                                NameType.LIVE_URL.ToString(),
                                                NameType.PAYMENT_REFUND_DETAILS_ROUTE.ToString(),
                                                NameType.PAYMENT_REFUND_NOTE_TO_PAYER.ToString(),
                                                NameType.PAYMENT_REFUND_ROUTE.ToString(),
                                                NameType.PAYMENTS_PAYOUTS_ROUTE.ToString(),
                                                NameType.PLAN_NAME.ToString(),
                                                NameType.PRODUCT_DESCRIPTION.ToString(),
                                                NameType.PRODUCT_ID.ToString(),
                                                NameType.PRODUCT_NAME.ToString(),
                                                NameType.PRODUCT_TYPE.ToString(),
                                                NameType.SANDBOX.ToString(),
                                                NameType.SANDBOX_URL.ToString(),
                                                NameType.SECRET.ToString(),
                                                NameType.SENDER_BATCH_HEADER_AUTO_PAY_EMAIL_MESSAGE.ToString(),
                                                NameType.SENDER_BATCH_HEADER_AUTO_PAY_EMAIL_SUBJECT.ToString(),
                                                NameType.SENDER_BATCH_ID_LENGTH_ARTIST_AUTO_PAYMENT.ToString(),
                                                NameType.SENDER_BATCH_ID_LENGTH_ARTIST_MANUAL_PAYMENT.ToString(),
                                                NameType.SUBSCRIPTION_CANCEL_ROUTE.ToString(),
                                                NameType.SUBSCRIPTION_DETAILS_ROUTE.ToString(),
                                                NameType.SUBSCRIPTION_TRANSACTION_LIST_ROUTE.ToString(),
                                                NameType.VOID_ORDERPAYMENT_ROUTE.ToString(),
                                        };

                try
                {

                    var list = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.PAYPAL.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (list == null || list.LongCount() == 0)
                    {
                        logger.Error($"PAYPAL required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (list.LongCount() != 30)
                    {
                        logger.Error($"PAYPAL required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {
                        var set1 = list.Where(p => p.Name == NameType.AUTHORIZE_ORDER_PAYMENT_ROUTE.ToString()).SingleOrDefault();
                        var set2 = list.Where(p => p.Name == NameType.BILLING_PLANS_ROUTE.ToString()).SingleOrDefault();
                        var set3 = list.Where(p => p.Name == NameType.CAPTURE_ORDERPAYMENT_ROUTE.ToString()).SingleOrDefault();
                        var set4 = list.Where(p => p.Name == NameType.CATALOGS_PRODUCTS_ROUTE.ToString()).SingleOrDefault();
                        var set5 = list.Where(p => p.Name == NameType.CLIENT_ID.ToString()).SingleOrDefault();
                        var set6 = list.Where(p => p.Name == NameType.CREATE_ORDER_ROUTE.ToString()).SingleOrDefault();
                        var set7 = list.Where(p => p.Name == NameType.CREATE_SUBSCRIPTION_ROUTE.ToString()).SingleOrDefault();
                        var set8 = list.Where(p => p.Name == NameType.CURRENCY.ToString()).SingleOrDefault();
                        var set9 = list.Where(p => p.Name == NameType.GENERATE_TOKEN_ROUTE.ToString()).SingleOrDefault();
                        var set10 = list.Where(p => p.Name == NameType.LIVE_URL.ToString()).SingleOrDefault();
                        var set11 = list.Where(p => p.Name == NameType.PAYMENT_REFUND_DETAILS_ROUTE.ToString()).SingleOrDefault();
                        var set12 = list.Where(p => p.Name == NameType.PAYMENT_REFUND_NOTE_TO_PAYER.ToString()).SingleOrDefault();
                        var set13 = list.Where(p => p.Name == NameType.PAYMENT_REFUND_ROUTE.ToString()).SingleOrDefault();
                        var set14 = list.Where(p => p.Name == NameType.PAYMENTS_PAYOUTS_ROUTE.ToString()).SingleOrDefault();
                        var set15 = list.Where(p => p.Name == NameType.PLAN_NAME.ToString()).SingleOrDefault();
                        var set16 = list.Where(p => p.Name == NameType.PRODUCT_DESCRIPTION.ToString()).SingleOrDefault();
                        var set17 = list.Where(p => p.Name == NameType.PRODUCT_ID.ToString()).SingleOrDefault();
                        var set18 = list.Where(p => p.Name == NameType.PRODUCT_NAME.ToString()).SingleOrDefault();
                        var set19 = list.Where(p => p.Name == NameType.PRODUCT_TYPE.ToString()).SingleOrDefault();
                        var set20 = list.Where(p => p.Name == NameType.SANDBOX.ToString()).SingleOrDefault();
                        var set21 = list.Where(p => p.Name == NameType.SANDBOX_URL.ToString()).SingleOrDefault();
                        var set22 = list.Where(p => p.Name == NameType.SECRET.ToString()).SingleOrDefault();
                        var set23 = list.Where(p => p.Name == NameType.SENDER_BATCH_HEADER_AUTO_PAY_EMAIL_MESSAGE.ToString()).SingleOrDefault();
                        var set24 = list.Where(p => p.Name == NameType.SENDER_BATCH_HEADER_AUTO_PAY_EMAIL_SUBJECT.ToString()).SingleOrDefault();
                        var set25 = list.Where(p => p.Name == NameType.SENDER_BATCH_ID_LENGTH_ARTIST_AUTO_PAYMENT.ToString()).SingleOrDefault();
                        var set26 = list.Where(p => p.Name == NameType.SENDER_BATCH_ID_LENGTH_ARTIST_MANUAL_PAYMENT.ToString()).SingleOrDefault();
                        var set27 = list.Where(p => p.Name == NameType.SUBSCRIPTION_CANCEL_ROUTE.ToString()).SingleOrDefault();
                        var set28 = list.Where(p => p.Name == NameType.SUBSCRIPTION_DETAILS_ROUTE.ToString()).SingleOrDefault();
                        var set29 = list.Where(p => p.Name == NameType.SUBSCRIPTION_TRANSACTION_LIST_ROUTE.ToString()).SingleOrDefault();
                        var set30 = list.Where(p => p.Name == NameType.VOID_ORDERPAYMENT_ROUTE.ToString()).SingleOrDefault();

                        settings.AuthorizeOrderPaymentUrl = set1.Value;
                        settings.BillingPlansUrl = set2.Value;
                        settings.CaptureOrderPaymentUrl = set3.Value;
                        settings.CatalogsProductsUrl = set4.Value;
                        settings.ClientId = set5.Value;
                        settings.CreateOrderUrl = set6.Value;
                        settings.CreateSubscriptionUrl = set7.Value;
                        settings.Currency = set8.Value;
                        settings.GenerateTokenUrl = set9.Value;
                        settings.LiveUrl = set10.Value;
                        settings.PaymentRefundDetailsRoute = set11.Value;
                        settings.PaymentRefundNoteToPayerRoute = set12.Value;
                        settings.PaymentRefundRoute = set13.Value;
                        settings.PaymentsPayoutsRoute = set14.Value;
                        settings.PlanName = set15.Value;
                        settings.ProductDescription = set16.Value;
                        settings.ProductId = set17.Value;
                        settings.ProductName = set18.Value;
                        settings.ProductType = set19.Value;
                        settings.IsSandbox = Convert.ToBoolean(Convert.ToInt32(set20.Value));
                        settings.SandboxUrl = set21.Value;
                        settings.Secret = set22.Value;
                        settings.SenderBatchHeaderAutoPayEmailMessage = set23.Value;
                        settings.SenderBatchIdLengthArtistManualPayment = set24.Value;
                        settings.SenderBatchIdLengthArtistAutoPayment = set25.Value;
                        settings.SenderBatchIdLengthArtistManualPayment = set26.Value;
                        settings.SubscriptionCancelRoute = set27.Value;
                        settings.SubscriptionDetailsUrl = set28.Value;
                        settings.SubscriptionTransactionListUrl = set29.Value;
                        settings.VoidOrderPaymentUrl = set30.Value;

                        return settings;

                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }

            return null;

        }

        public static SmtpSettings_v2 GetSMTPSettings(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var settings = new SmtpSettings_v2();

                var requiredSettings = new string[]
                                        {
                                                NameType.HOST.ToString(),
                                                NameType.MAIL_FROM.ToString(),
                                                NameType.PASSWORD.ToString(),
                                                NameType.PORT.ToString(),
                                                NameType.USER_NAME.ToString(),
                                        };

                try
                {

                    var list = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.SMTP.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (list == null || list.LongCount() == 0)
                    {
                        logger.Error($"SMTP required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.SMTP} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (list.LongCount() != 5)
                    {
                        logger.Error($"SMTP required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.SMTP} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {
                        var set1 = list.Where(p => p.Name == NameType.HOST.ToString()).SingleOrDefault();
                        var set2 = list.Where(p => p.Name == NameType.MAIL_FROM.ToString()).SingleOrDefault();
                        var set3 = list.Where(p => p.Name == NameType.PASSWORD.ToString()).SingleOrDefault();
                        var set4 = list.Where(p => p.Name == NameType.PORT.ToString()).SingleOrDefault();
                        var set5 = list.Where(p => p.Name == NameType.USER_NAME.ToString()).SingleOrDefault();
                        
                        settings.Host = set1.Value;
                        settings.MailFrom = set2.Value;
                        settings.Password = set3.Value;
                        settings.Port = Convert.ToInt32(set4.Value);
                        settings.Username = set5.Value;

                        return settings;

                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.SMTP} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }

            return null;
        }

        public static FrontSiteUrlSettings_v2 GetFrontSiteUrlSettings(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var settings = new FrontSiteUrlSettings_v2();

                var requiredSettings = new string[]
                                        {
                                                NameType.ARTIST_PAGE_ROUTE.ToString(),
                                                NameType.ARTIST_PROFILE_ROUTE.ToString(),
                                                NameType.FORGOT_PASSWORD_CONFIRMATION_ROUTE.ToString(),
                                                NameType.MY_PAGE_ROUTE.ToString(),
                                                NameType.SIGN_UP_CONFIRMATION_ROUTE.ToString(),
                                                NameType.URL.ToString(),
                                                NameType.USER_PROFILE_ROUTE.ToString(),
                                                NameType.WATCH_PAID_CONTENT_VIDE_ROUTE.ToString(),
                                                NameType.WEBINAR_SCHEDULE_LIVE_ROUTE.ToString(),
                                        };

                try
                {

                    var list = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.FRONT_SITE.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (list == null || list.LongCount() == 0)
                    {
                        logger.Error($"SMTP required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.SMTP} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (list.LongCount() != 9)
                    {
                        logger.Error($"SMTP required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.SMTP} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {
                        var set1 = list.Where(p => p.Name == NameType.ARTIST_PAGE_ROUTE.ToString()).SingleOrDefault();
                        var set2 = list.Where(p => p.Name == NameType.ARTIST_PROFILE_ROUTE.ToString()).SingleOrDefault();
                        var set3 = list.Where(p => p.Name == NameType.FORGOT_PASSWORD_CONFIRMATION_ROUTE.ToString()).SingleOrDefault();
                        var set4 = list.Where(p => p.Name == NameType.MY_PAGE_ROUTE.ToString()).SingleOrDefault();
                        var set5 = list.Where(p => p.Name == NameType.SIGN_UP_CONFIRMATION_ROUTE.ToString()).SingleOrDefault();
                        var set6 = list.Where(p => p.Name == NameType.URL.ToString()).SingleOrDefault();
                        var set7 = list.Where(p => p.Name == NameType.USER_PROFILE_ROUTE.ToString()).SingleOrDefault();
                        var set8 = list.Where(p => p.Name == NameType.WATCH_PAID_CONTENT_VIDE_ROUTE.ToString()).SingleOrDefault();
                        var set9 = list.Where(p => p.Name == NameType.WEBINAR_SCHEDULE_LIVE_ROUTE.ToString()).SingleOrDefault();

                        settings.ArtistPageUrl = set1.Value;
                        settings.ArtistProfileRoute = set2.Value;
                        settings.ForgotPasswordConfirmationUrl = set3.Value;
                        settings.MyPageRoute = set4.Value;
                        settings.SignUpConfirmationUrl = set5.Value;
                        settings.FrontSiteUrl = set6.Value;
                        settings.UserProfileRoute = set7.Value;
                        settings.WatchPaidContentVideoUrl = set8.Value;
                        settings.WebinarScheduleLiveRoute = set9.Value;

                        return settings;

                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.FRONT_SITE} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }

            return null;
        }

        public static ZoomSettings_v2 GetZoomSettings(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var settings = new ZoomSettings_v2();

                var requiredSettings = new string[]
                                        {
                                                NameType.CREATE_WEBINAR_TOKEN_EXPIRATION.ToString(),
                                                NameType.DELETE_WEBINAR_ROUTE.ToString(),
                                                NameType.DELETE_WEBINAR_TOKEN_EXPIRATION.ToString(),
                                                NameType.GET_USER_ZOOM_ID_TOKEN_EXPIRATION.ToString(),
                                                NameType.LIST_ALL_RECORDINGS_ROUTE.ToString(),
                                                NameType.LIST_USERS_ROUTE.ToString(),
                                                NameType.LIST_WEBINARS_ROUTE.ToString(),
                                                NameType.UPDATE_WEBINAR_ROUTE.ToString(),
                                                NameType.URL.ToString(),
                                                NameType.WEBHOOK_AUTHORIZATION.ToString(),
                                                NameType.WEBINAR_DETAIL_ROUTE.ToString(),
                                                NameType.WEBINAR_END_EVENT.ToString(),
                                                NameType.WEBINAR_START_EVENT.ToString(),
                                                NameType.WEBINAR_ZOOM_RECORDING_DOWNLOAD_TOKEN_EXPIRATION.ToString(),
                                                NameType.WEBINAR_ZOOM_RECORDING_FETCH_TOKEN_EXPIRATION.ToString(),
                                        };

                try
                {

                    var list = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.ZOOM.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (list == null || list.LongCount() == 0)
                    {
                        logger.Error($"ZOOM required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.ZOOM} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (list.LongCount() != 15)
                    {
                        logger.Error($"ZOOM required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.ZOOM} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {
                        var set1 = list.Where(p => p.Name == NameType.CREATE_WEBINAR_TOKEN_EXPIRATION.ToString()).SingleOrDefault();
                        var set2 = list.Where(p => p.Name == NameType.DELETE_WEBINAR_ROUTE.ToString()).SingleOrDefault();
                        var set3 = list.Where(p => p.Name == NameType.DELETE_WEBINAR_TOKEN_EXPIRATION.ToString()).SingleOrDefault();
                        var set4 = list.Where(p => p.Name == NameType.GET_USER_ZOOM_ID_TOKEN_EXPIRATION.ToString()).SingleOrDefault();
                        var set5 = list.Where(p => p.Name == NameType.LIST_ALL_RECORDINGS_ROUTE.ToString()).SingleOrDefault();
                        var set6 = list.Where(p => p.Name == NameType.LIST_USERS_ROUTE.ToString()).SingleOrDefault();
                        var set7 = list.Where(p => p.Name == NameType.LIST_WEBINARS_ROUTE.ToString()).SingleOrDefault();
                        var set8 = list.Where(p => p.Name == NameType.UPDATE_WEBINAR_ROUTE.ToString()).SingleOrDefault();
                        var set9 = list.Where(p => p.Name == NameType.URL.ToString()).SingleOrDefault();
                        var set10 = list.Where(p => p.Name == NameType.WEBHOOK_AUTHORIZATION.ToString()).SingleOrDefault();
                        var set11 = list.Where(p => p.Name == NameType.WEBINAR_DETAIL_ROUTE.ToString()).SingleOrDefault();
                        var set12 = list.Where(p => p.Name == NameType.WEBINAR_END_EVENT.ToString()).SingleOrDefault();
                        var set13 = list.Where(p => p.Name == NameType.WEBINAR_START_EVENT.ToString()).SingleOrDefault();
                        var set14 = list.Where(p => p.Name == NameType.WEBINAR_ZOOM_RECORDING_DOWNLOAD_TOKEN_EXPIRATION.ToString()).SingleOrDefault();
                        var set15 = list.Where(p => p.Name == NameType.WEBINAR_ZOOM_RECORDING_FETCH_TOKEN_EXPIRATION.ToString()).SingleOrDefault();


                        settings.CreateWebinarTokenExpiration = Convert.ToInt32(set1.Value);
                        settings.DeleteWebinarRoute = set2.Value;
                        settings.DeleteWebinarTokenExpiration = Convert.ToInt32(set3.Value);
                        settings.GetUserZoomIdTokenExpiration = Convert.ToInt32(set4.Value);
                        settings.ListAllRecordingsRoute = set5.Value;
                        settings.ListUsersRoute = set6.Value;
                        settings.ListWebinarsRoute = set7.Value;
                        settings.UpdateWebinarRoute = set8.Value;
                        settings.Url = set9.Value;
                        settings.WebhookAuthorization = set10.Value;
                        settings.WebinarDetailRoute = set11.Value;
                        settings.WebinarEndEvent = set12.Value;
                        settings.WebinarStartEvent = set13.Value;
                        settings.WebinarZoomRecordingDownloaderCronTokenExpiration = Convert.ToInt32(set14.Value);
                        settings.WebinarZoomRecordingFetcherCronTokenExpiration = Convert.ToInt32(set15.Value);

                        return settings;

                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }

            return null;

        }

        public static IpfsSettings_v2 GetIPFSSettings(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var settings = new IpfsSettings_v2();

                var requiredSettings = new string[]
                                        {
                                                NameType.URL.ToString(),
                                        };

                try
                {

                    var list = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.IPFS.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (list == null || list.LongCount() == 0)
                    {
                        logger.Error($"IPFS required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.IPFS} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (list.LongCount() != 1)
                    {
                        logger.Error($"SMTP required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.IPFS} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {
                        var set1 = list.Where(p => p.Name == NameType.URL.ToString()).SingleOrDefault();

                        settings.Host = set1.Value;

                        return settings;

                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.IPFS} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }

            return null;
        }

        public static ImageSettings_v2 GetImageSettings(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var settings = new ImageSettings_v2();

                var requiredSettings = new string[]
                                        {
                                                NameType.SERVER_URL.ToString(),
                                                NameType.SUPPORTED_FORMAT.ToString(),
                                                NameType.VIDEO_THUMBNAIL_SIZE.ToString(),
                                                NameType.WEBINAR_THUMBNAIL_SIZE.ToString(),
                                                NameType.PROFILE_PICTURE_MAX_FILE_SIZE.ToString(),
                                        };

                try
                {

                    var list = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.IMAGE.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (list == null || list.LongCount() == 0)
                    {
                        logger.Error($"IMAGE required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.IMAGE} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (list.LongCount() != 5)
                    {
                        logger.Error($"IMAGE required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.IMAGE} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {
                        var set1 = list.Where(p => p.Name == NameType.SERVER_URL.ToString()).SingleOrDefault();
                        var set2 = list.Where(p => p.Name == NameType.SUPPORTED_FORMAT.ToString()).SingleOrDefault();
                        var set3 = list.Where(p => p.Name == NameType.VIDEO_THUMBNAIL_SIZE.ToString()).SingleOrDefault();
                        var set4 = list.Where(p => p.Name == NameType.WEBINAR_THUMBNAIL_SIZE.ToString()).SingleOrDefault();
                        var set5 = list.Where(p => p.Name == NameType.PROFILE_PICTURE_MAX_FILE_SIZE.ToString()).SingleOrDefault();

                        settings.ServerUrl = set1.Value;
                        settings.SupportedFormat = set2.Value;
                        settings.VideoThumbnailSize = set3.Value;
                        settings.WebinarThumbnailSize = set4.Value;
                        settings.ProfilePictureMaxFileSize = set5.Value;

                        return settings;

                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.IMAGE} AND Name IN ({requiredSettings})");
                }

            }

            return null;
        }

        public static VideoSettings_v2 GetVideoSettings(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var settings = new VideoSettings_v2();

                var requiredSettings = new string[]
                                        {
                                                NameType.SERVER_URL.ToString(),
                                                NameType.SUPPORTED_FORMAT.ToString(),
                                        };

                try
                {

                    var list = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.VIDEO.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (list == null || list.LongCount() == 0)
                    {
                        logger.Error($"VIDEO required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.VIDEO} AND Name IN ({requiredSettings})");
                    }
                    else if (list.LongCount() != 2)
                    {
                        logger.Error($"VIDEO required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.VIDEO} AND Name IN ({requiredSettings})");
                    }
                    else
                    {
                        var set1 = list.Where(p => p.Name == NameType.SERVER_URL.ToString()).SingleOrDefault();
                        var set2 = list.Where(p => p.Name == NameType.SUPPORTED_FORMAT.ToString()).SingleOrDefault();

                        settings.ServerUrl = set1.Value;
                        settings.SupportedFormat = set2.Value;

                        return settings;

                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.VIDEO} AND Name IN ({requiredSettings})");
                }

            }

            return null;
        }

        public static void GetPaypalSenderBatchHeaderEmailSubjectAndMessage(List<Core.Domain.SysSettings.SysSettings> sysSettings, out string emailSubject, out string emailMessage, IWeRaveYouLog logger)
        {
            emailSubject = "";
            emailMessage = "";

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var requiredSettings = new string[]
                                        {
                                                NameType.SENDER_BATCH_HEADER_EMAIL_SUBJECT.ToString(),
                                                NameType.SENDER_BATCH_HEADER_EMAIL_MESSAGE.ToString(),
                                        };

                try
                {

                    var settings = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.PAYPAL.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (settings == null || settings.LongCount() == 0)
                    {
                        logger.Error($"PAYPAL SenderBatchHeader required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({requiredSettings})");
                    }
                    else if (settings.LongCount() != 2)
                    {
                        logger.Error($"PAYPAL SenderBatchHeader required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({requiredSettings})");
                    }
                    else
                    {
                        var subject = settings.Where(p => p.Name == NameType.SENDER_BATCH_HEADER_EMAIL_SUBJECT.ToString()).SingleOrDefault();
                        var message = settings.Where(p => p.Name == NameType.SENDER_BATCH_HEADER_EMAIL_MESSAGE.ToString()).SingleOrDefault();

                        emailSubject = subject.Value;
                        emailMessage = message.Value;
                    }
                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({requiredSettings})");
                }

            }

        }

        public static void SetArtistFees(ProfitPercentage entity, List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                if (entity == null)
                {
                    logger.Error($"ProfitPercentage must be initialized");
                    logger.Debug($"WHERE ProfitPercentage IS NULL");

                    return;
                }

                var requiredSettings = new string[]
                                        {
                                                NameType.ARTIST_PAYPERVIEW_FEE.ToString(),
                                                NameType.ARTIST_LIVETICKET_FEE.ToString(),
                                                NameType.ARTIST_SUBSCRIPTION_FEE.ToString(),
                                        };
                try
                {

                    var settings = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.APP.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (settings == null || settings.LongCount() == 0)
                    {
                        logger.Error($"ARTIST required FEES not found");
                        logger.Debug($"WHERE Settings={SettingsType.APP} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (settings.LongCount() != 3)
                    {
                        logger.Error($"ARTIST required FEES incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.APP} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {
                        try
                        {

                            var payperview = settings.Where(p => p.Name == NameType.ARTIST_PAYPERVIEW_FEE.ToString()).SingleOrDefault();
                            var liveticket = settings.Where(p => p.Name == NameType.ARTIST_LIVETICKET_FEE.ToString()).SingleOrDefault();
                            var subscription = settings.Where(p => p.Name == NameType.ARTIST_SUBSCRIPTION_FEE.ToString()).SingleOrDefault();


                            entity.PayPerView = Convert.ToInt32(payperview.Value);
                            entity.LiveTicket = Convert.ToInt32(liveticket.Value);
                            entity.Subscription = Convert.ToInt32(subscription.Value);

                        }
                        catch (Exception ex1)
                        {
                            logger.Error($"While trying to convert to settings value to Int32: {ex1}");
                            logger.Debug($"WHERE Settings={SettingsType.APP} AND Name IN ({string.Join(',',requiredSettings)})");
                        }
                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.APP} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }

        }

        public static string GetPaypalCurrency(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {
            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                try
                {

                    var record = sysSettings
                                            .Where(p =>
                                                        p.Settings == SettingsType.PAYPAL.ToString() &&
                                                        p.Name == NameType.CURRENCY.ToString())
                                            .SingleOrDefault();

                    if (record != null)
                    {
                        return record.Value;
                    }

                    logger.Error($"No record found on sys_settings table");
                    logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name={NameType.CURRENCY}");

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.IMAGE} AND Name={NameType.SERVER_URL}");
                }

            }

            return "";

        }

        public static string GetImageServerUrl(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {
            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                try
                {

                    var record = sysSettings
                                            .Where(p =>
                                                        p.Settings == SettingsType.IMAGE.ToString() &&
                                                        p.Name == NameType.SERVER_URL.ToString())
                                            .SingleOrDefault();

                    if (record != null)
                    {
                        return record.Value;
                    }

                    logger.Debug($"No record found on sys_settings table");
                    logger.Debug($"WHERE Settings={SettingsType.IMAGE} AND Name={NameType.SERVER_URL}");

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.IMAGE} AND Name={NameType.SERVER_URL}");
                }

            }

            return null;

        }

        public static string GetArtistOrUserProfileUrl(string userName, UserType? userType, List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {
            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                try
                {

                    var frontUrl = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.FRONT_SITE.ToString() &&
                                            p.Name == NameType.URL.ToString())
                                    .SingleOrDefault();

                    if (frontUrl == null)
                    {
                        return "-";
                    }


                    string url = null;
                    if (userType == UserType.Basic)
                    {
                        try
                        {
                            var route = sysSettings
                                            .Where(p =>
                                                    p.Settings == SettingsType.FRONT_SITE.ToString() &&
                                                    p.Name == NameType.USER_PROFILE_ROUTE.ToString())
                                            .SingleOrDefault();

                            if (route != null)
                            {
                                url = string.Format("{0}{1}", frontUrl.Value, route.Value);
                            }
                            else
                            {
                                url = frontUrl.Value;
                            }

                        }
                        catch (Exception ex1)
                        {
                            logger.Error($"While trying to get record from sys_settings table: {ex1}");
                            logger.Debug($"WHERE Settings={SettingsType.FRONT_SITE} AND Name={NameType.USER_PROFILE_ROUTE}");
                        }
                    }
                    else
                    {
                        try
                        {
                            var route = sysSettings
                                            .Where(p =>
                                                    p.Settings == SettingsType.FRONT_SITE.ToString() &&
                                                    p.Name == NameType.ARTIST_PROFILE_ROUTE.ToString())
                                            .SingleOrDefault();

                            if (route != null)
                            {
                                url = string.Format("{0}{1}", frontUrl.Value, route.Value);
                            }
                            else
                            {
                                url = frontUrl.Value;
                            }

                        }
                        catch (Exception ex2)
                        {
                            logger.Error($"While trying to get record from sys_settings table: {ex2}");
                            logger.Debug($"WHERE Settings={SettingsType.FRONT_SITE} AND Name={NameType.ARTIST_PROFILE_ROUTE}");
                        }

                    }

                    return string.Format(url, userName);

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.FRONT_SITE} AND Name={NameType.URL}");
                }

            }

            return null;

        }

        public static void GetPaypalClientIdSecretSubscriptionCancelUrl(out string clientId, out string secret, out string subscriptionCancelUrl, List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {
            clientId = "";
            secret = "";
            subscriptionCancelUrl = "";

            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var requiredSettings = new string[]
                                        {
                                                NameType.SANDBOX.ToString(),
                                                NameType.SANDBOX_URL.ToString(),
                                                NameType.LIVE_URL.ToString(),
                                                NameType.CLIENT_ID.ToString(),
                                                NameType.SECRET.ToString(),
                                                NameType.SUBSCRIPTION_CANCEL_ROUTE.ToString(),
                                        };

                try
                {

                    var settings = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.PAYPAL.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (settings == null || settings.LongCount() == 0)
                    {
                        logger.Error($"PAYPAL required settings not found");
                        logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (settings.LongCount() != 6)
                    {
                        logger.Error($"PAYPAL required settings incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {

                        var sandbox = settings.Where(p => p.Name == NameType.SANDBOX.ToString()).SingleOrDefault();
                        var sandboxUrl = settings.Where(p => p.Name == NameType.SANDBOX_URL.ToString()).SingleOrDefault();
                        var liveUrl = settings.Where(p => p.Name == NameType.LIVE_URL.ToString()).SingleOrDefault();
                        var clientSet = settings.Where(p => p.Name == NameType.CLIENT_ID.ToString()).SingleOrDefault();
                        var secretSet = settings.Where(p => p.Name == NameType.SECRET.ToString()).SingleOrDefault();
                        var subscriptionCancelRoute = settings.Where(p => p.Name == NameType.SUBSCRIPTION_CANCEL_ROUTE.ToString()).SingleOrDefault();



                        clientId = clientSet.Value;
                        secret = secretSet.Value;
                        subscriptionCancelUrl = string.Format("{0}{1}", Convert.ToInt32(sandbox.Value) == 1 ? sandboxUrl.Value : liveUrl.Value, subscriptionCancelRoute.Value);
                    }
                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.PAYPAL} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }
        }

        public static string GetFrontSiteWebinarScheduleLiveUrl(List<Core.Domain.SysSettings.SysSettings> sysSettings, IWeRaveYouLog logger)
        {
            if (sysSettings != null && sysSettings.LongCount() > 0)
            {

                var requiredSettings = new string[]
                        {
                                                NameType.URL.ToString(),
                                                NameType.WEBINAR_SCHEDULE_LIVE_ROUTE.ToString(),
                        };

                try
                {

                    var settings = sysSettings
                                    .Where(p =>
                                            p.Settings == SettingsType.FRONT_SITE.ToString() &&
                                            requiredSettings.Contains(p.Name))
                                    .ToList();

                    if (settings == null || settings.LongCount() == 0)
                    {
                        logger.Error($"FRONT SITE required URLs not found");
                        logger.Debug($"WHERE Settings={SettingsType.FRONT_SITE} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else if (settings.LongCount() != 2)
                    {
                        logger.Error($"FRONT SITE required URLs incomplete");
                        logger.Debug($"WHERE Settings={SettingsType.FRONT_SITE} AND Name IN ({string.Join(',',requiredSettings)})");
                    }
                    else
                    {

                        try
                        {

                            var url = settings.Where(p => p.Name == NameType.URL.ToString()).SingleOrDefault();
                            var route = settings.Where(p => p.Name == NameType.WEBINAR_SCHEDULE_LIVE_ROUTE.ToString()).SingleOrDefault();

                            return string.Format("{0}{1}", url.Value, route.Value);
                        }
                        catch (Exception ex1)
                        {
                            logger.Error($"While trying to get Paypal list of webinars Url: {ex1}");
                            logger.Debug($"WHERE Settings={SettingsType.FRONT_SITE} AND Name IN ({string.Join(',',requiredSettings)})");
                        }
                    }

                }
                catch (Exception ex)
                {
                    logger.Error($"While trying to get record from sys_settings table: {ex}");
                    logger.Debug($"WHERE Settings={SettingsType.FRONT_SITE} AND Name IN ({string.Join(',',requiredSettings)})");
                }

            }

            return null;

        }

    }
}
