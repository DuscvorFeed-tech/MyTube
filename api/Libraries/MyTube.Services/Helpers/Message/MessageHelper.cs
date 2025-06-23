using System;

namespace MyTube.Services.Helpers.Message
{
    public static class MessageHelper
    {

        public readonly static string Error401 = "Unauthorized user";

        public readonly static string Error404 = "Not Found";

        public readonly static string Error415 = "Unsupported Media Type";



        public readonly static string UndefinedErrorCode = "Error.";

        public readonly static string DatabaseError = "Database error.";



        public readonly static string Invalid = "Invalid";

        public readonly static string Required = "Required";

        public readonly static string NotMatch = "Not match";

        public readonly static string LessThanRequiredMinLength = "Less than required min length";

        public readonly static string MoreThanAllowedMaxLength = "Greater than allowed max length";

        public readonly static string InvalidLoginCredentials = "Cannot authenticate user";

        public readonly static string MustBeFutureDate = "Must be future date";

        public readonly static string MustBeGreaterThan = "Must be greater than";

        public readonly static string FileSizeMoreThanMaximumAllowed = "File size more than maximum allowed";



        public readonly static string NoRecordFound = "No record found";

        public readonly static string AlreadyRegistered = "Registered";

        public readonly static string UserDoesNotHaveRegisteredZoomApp = "User does not have a registered zoom app";

        public readonly static string NotAllowedToPurchaseOwnContent = "Not allowed to purchase your own content";

        public readonly static string SubscriptionSettingsIsAllowedForCreatorUserOnly = "Subscription settings is allowed for Creator user only";

        public readonly static string CannotSubscribeToOwnAccount = "You cannot subscribe to your own account";

        public readonly static string ArtistSubscriptionIsRequired = "Subscription is required";

        public readonly static string PaidContentOptionOnlyForCreators = "Paid Content option is only allowed for Creators";

        public readonly static string ExistingValidCouponCodeFound = "An existing valid coupon code found. Please use it or activate it";

        public readonly static string AlreadyPurchasedLiveTicket = "You already purchased ticket for this live event.";

        public readonly static string AlreadySubscribedToArtist = "You already subscribed to this artist.";

        public readonly static string LiveTicketsSold = "Cannot proceed all tickets were sold";

        public readonly static string WaitingForPaymentConfirmation = "Waiting for payment confirmation";

        public readonly static string ArtistAccountIsInactive = "Artist account is inactive";

        public readonly static string ArtistSubscriptionIsRequiredForLiveTicketSlot = "Artist subscription is required to be able to request for live ticket slot";




        public readonly static string FileNotSupported = "File not supported";

        public readonly static string FailedUploadingFileToServer = "An error occured while uploading your video to our server";

        public readonly static string FailedGeneratingThumbnails = "An error occurrd while generating video thumbnails";

        public readonly static string UserUploadSameVideo = "You cannot upload the same video";

        public readonly static string DeleteNotAllowed = "Delete not allowed";

        public readonly static string FailedGeneratingHash = "An error occured while generating hash";




        public readonly static string IPFS_FailedUploadingFile = "There is an error occurred while processing your request";



        public readonly static string Zoom_FailedGeneratingToken = "Failed generating token. Invalid API Key & API Secret";

        public readonly static string Zoom_FailedFetchingZoomId = "Failed fetching user's Zoom Id";

        public readonly static string Zoom_FailedCreatingWebinar = "Failed fetching user's Zoom Id";



        public readonly static string Paypal_FailedCreatingPayperviewOrder = "An error occured while creating payperview order";

        public readonly static string Paypal_FailedGettingPayperviewOrderUrl = "Failed getting payperview order url";

        public readonly static string Paypal_PayperviewOrderUrlNotFound = "Payperview order url not found";

        public readonly static string Paypal_FailedOrderPaymentAuthorization = "An error occured while trying to authorize order payment";

        public readonly static string Paypal_OrderPaymentAuthorizationStatusUnknown = "Order payment status unknown";

        public readonly static string Paypal_OrderPaymentAuthorizationIdNotFound = "Order payment authorization id not found";

        public readonly static string Paypal_FailedCapturingOrderPayment = "An error occured while trying to capture order payment";

        public readonly static string Paypal_CaptureOrderPaymentStatusUnknown = "Capture order payment status unknown";

        public readonly static string Paypal_OrderPaymentCaptureIdNotFound = "Order payment capture id not found";

        public readonly static string Paypal_OrderPaymentPaymentInfoIncomplete = "Order payment info incomplete";

        public readonly static string Paypal_FailedCreatingLiveTicketOrder = "An error occured while creating live ticket order";

        public readonly static string Paypal_FailedCreatingSubscription = "An error occured while creating Paypal's subscription";

        public readonly static string Paypal_FailedGettingLiveTicketOrderUrl = "Failed getting live ticket order url";

        public readonly static string Paypal_FailedGettingSubscriptionUrl = "Failed getting subscription url";

        public readonly static string Paypal_SubscriptionUrlNotFound = "Subscription url not found";

        public readonly static string Paypal_FailedGettingSubscriptionDetails = "An error occured while trying to get subscription details";

        public readonly static string Paypal_SubscriptionStatusUnknown = "Subscription payment status unknown";

        public readonly static string Paypal_SubscriptionPaymentApprovalPending = "Subscription payment must be approved";

        public readonly static string Paypal_SubscriptionCancelFailed = "Failed cancelling subscription";

        public readonly static string Paypal_SubscriptionSettingsNotFoundInDb = "Cannot cancel your subscription at the moment please try again later";


        public readonly static string FilPaymentGateway_WalletCreateResponseNull = "";
        public readonly static string FilPaymentGateway_WalletCreateResponseNotRecognized = "";
        public readonly static string FilPaymentGateway_WalletCreateResponseWalletAddressIsNull = "";
        public readonly static string FilPaymentGateway_WalletCreateResponsePrivateKeyIsNull = "";


    }

}
