namespace MyTube.Services.Helpers.Message
{
    public struct ErrorCodes
    {

        #region Default web status codes

        public static string Error401 = "401";

        public static string Error404 = "404";

        public static string Error415 = "415";

        #endregion

        #region Internal server error codes

        public static string UndefinedErrorCode = "E0x00";

        public static string DatabaseError = "E0x01";

        #endregion

        #region Validation error codes

        public static string Invalid = "E0001";

        public static string Required = "E0002";

        public static string NotMatch = "E0003";

        public static string LessThanRequiredMinLength = "E0004";

        public static string MoreThanAllowedMaxLength = "E0005";

        public static string InvalidLoginCredentials = "E0006";

        public static string MustBeFutureDate = "E0007";

        public static string MustBeGreaterThan = "E0008";
        
        public static string FileSizeMoreThanMaximumAllowed = "E0009";

        #endregion

        #region DB record error codes

        public static string NoRecordFound = "E0030";

        public static string AlreadyRegistered = "E0031";

        public static string UserDoesNotHaveRegisteredZoomApp = "E0032";

        public static string CannotDeleteWebinar = "E0033";

        public static string NotAllowedToPurchaseOwnContent = "E0034";

        public static string SubscriptionSettingsIsAllowedForCreatorUserOnly = "E0035";

        public static string CannotSubscribeToOwnAccount = "E0036";

        public static string ArtistSubscriptionIsRequired = "E0037";

        public static string PaidContentOptionOnlyForCreators = "E0038";

        public static string ExistingValidCouponCodeFound = "E0040";

        public static string AlreadyPurchasedLiveTicket = "E0041";

        public static string AlreadySubscribedToArtist = "E0042";

        public static string LiveTicketsSold = "E0043";

        public static string WaitingForPaymentConfirmation = "E0044";

        public static string ArtistAccountIsInactive = "E0045";

        public static string ArtistSubscriptionIsRequiredForLiveTicketSlot = "E0046";

        #endregion

        #region Server error codes

        public static string FileNotSupported = "E0060";

        public static string FailedUploadingFileToServer = "E0061";

        public static string FailedGeneratingThumbnails = "E0062";

        public static string UserUploadSameVideo = "E0063";

        public static string FailedGeneratingHash = "E0064";

        #endregion

        #region IPFS error codes

        public static string IPFS_FailedUploadingFile = "E0090";

        #endregion

        #region Zoom error codes

        public static string Zoom_FailedGeneratingToken = "E0110";

        public static string Zoom_FailedFetchingZoomId = "E0111";

        public static string Zoom_FailedCreatingWebinar = "E0112";

        #endregion

        #region Paypal error codes

        public static string Paypal_FailedCreatingPayperviewOrder = "E0130";

        public static string Paypal_FailedGettingPayperviewOrderUrl = "E0131";

        public static string Paypal_PayperviewOrderUrlNotFound = "E0132";

        public static string Paypal_FailedOrderPaymentAuthorization = "E0133";

        public static string Paypal_OrderPaymentAuthorizationStatusUnknown = "E0134";

        public static string Paypal_OrderPaymentAuthorizationIdNotFound = "E0135";

        public static string Paypal_FailedCapturingOrderPayment = "E0136";

        public static string Paypal_CaptureOrderPaymentStatusUnknown = "E0137";

        public static string Paypal_OrderPaymentCaptureIdNotFound = "E0138";

        public static string Paypal_OrderPaymentPaymentInfoIncomplete = "E0139";

        public static string Paypal_FailedCreatingLiveTicketOrder = "E0140";

        public static string Paypal_FailedCreatingSubscription = "E0141";

        public static string Paypal_FailedGettingLiveTicketOrderUrl = "E0142";

        public static string Paypal_FailedGettingSubscriptionUrl = "E0143";

        public static string Paypal_SubscriptionUrlNotFound = "E0144";

        public static string Paypal_FailedGettingSubscriptionDetails = "E0145";

        public static string Paypal_SubscriptionStatusUnknown = "E0146";

        public static string Paypal_SubscriptionPaymentApprovalPending = "E0147";

        public static string Paypal_SubscriptionCancelFailed = "E0148";

        public static string Paypal_SubscriptionSettingsNotFoundInDb = "E0149";

        #endregion


        #region FIL Payment Gateway error codes

        public static string FilPaymentGateway_WalletCreateResponseNull = "E0200";
        public static string FilPaymentGateway_WalletCreateResponseNotRecognized = "E0201";
        public static string FilPaymentGateway_WalletCreateResponseWalletAddressIsNull = "E0202";
        public static string FilPaymentGateway_WalletCreateResponsePrivateKeyIsNull = "E0203";

        #endregion


        public static string GetErrorCode(string errorMessage)
        {
            var formatErrorMessage = errorMessage.ToLower();

            if (formatErrorMessage.Equals(MessageHelper.Error404.ToLower()))
            {
                return Error404;
            }

            if (formatErrorMessage.Equals(MessageHelper.Error415.ToLower()))
            {
                return Error415;
            }

            if (formatErrorMessage.Equals(MessageHelper.DatabaseError.ToLower()))
            {
                return DatabaseError;
            }

            if (formatErrorMessage.Equals(MessageHelper.Invalid.ToLower()))
            {
                return Invalid;
            }

            if (formatErrorMessage.Equals(MessageHelper.InvalidLoginCredentials.ToLower()))
            {
                return InvalidLoginCredentials;
            }

            if (formatErrorMessage.Equals(MessageHelper.Required.ToLower()))
            {
                return Required;
            }

            if (formatErrorMessage.Equals(MessageHelper.LessThanRequiredMinLength.ToLower()))
            {
                return LessThanRequiredMinLength;
            }

            if (formatErrorMessage.Equals(MessageHelper.MoreThanAllowedMaxLength.ToLower()))
            {
                return MoreThanAllowedMaxLength;
            }

            if (formatErrorMessage.Equals(MessageHelper.AlreadyRegistered.ToLower()))
            {
                return AlreadyRegistered;
            }

            if (formatErrorMessage.Equals(MessageHelper.NotMatch.ToLower()))
            {
                return NotMatch;
            }

            if(formatErrorMessage.Equals(MessageHelper.Zoom_FailedGeneratingToken.ToLower()))
            {
                return Zoom_FailedGeneratingToken;
            }

            if (formatErrorMessage.Equals(MessageHelper.Zoom_FailedFetchingZoomId.ToLower()))
            {
                return Zoom_FailedFetchingZoomId;
            }

            if (formatErrorMessage.Equals(MessageHelper.NoRecordFound.ToLower()))
            {
                return NoRecordFound;
            }

            if (formatErrorMessage.Equals(MessageHelper.FileNotSupported.ToLower()))
            {
                return FileNotSupported;
            }

            if (formatErrorMessage.Equals(MessageHelper.FailedGeneratingThumbnails.ToLower()))
            {
                return FailedGeneratingThumbnails;
            }

            if (formatErrorMessage.Equals(MessageHelper.FailedUploadingFileToServer.ToLower()))
            {
                return FailedUploadingFileToServer;
            }

            if (formatErrorMessage.Equals(MessageHelper.IPFS_FailedUploadingFile.ToLower()))
            {
                return IPFS_FailedUploadingFile;
            }

            if (formatErrorMessage.Equals(MessageHelper.UserUploadSameVideo.ToLower()))
            {
                return UserUploadSameVideo;
            }

            if (formatErrorMessage.Equals(MessageHelper.UserDoesNotHaveRegisteredZoomApp.ToLower()))
            {
                return UserDoesNotHaveRegisteredZoomApp;
            }

            if (formatErrorMessage.Equals(MessageHelper.Zoom_FailedCreatingWebinar.ToLower()))
            {
                return Zoom_FailedCreatingWebinar;
            }

            if (formatErrorMessage.Equals(MessageHelper.MustBeFutureDate.ToLower()))
            {
                return MustBeFutureDate;
            }

            if (formatErrorMessage.Equals(MessageHelper.MustBeGreaterThan.ToLower()))
            {
                return MustBeGreaterThan;
            }
            
            if (formatErrorMessage.Equals(MessageHelper.FileSizeMoreThanMaximumAllowed.ToLower()))
            {
                return FileSizeMoreThanMaximumAllowed;
            }

            if (formatErrorMessage.Equals(MessageHelper.FailedGeneratingHash.ToLower()))
            {
                return FailedGeneratingHash;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedCreatingPayperviewOrder.ToLower()))
            {
                return Paypal_FailedCreatingPayperviewOrder;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedGettingPayperviewOrderUrl.ToLower()))
            {
                return Paypal_FailedGettingPayperviewOrderUrl;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_PayperviewOrderUrlNotFound.ToLower()))
            {
                return Paypal_PayperviewOrderUrlNotFound;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedOrderPaymentAuthorization.ToLower()))
            {
                return Paypal_FailedOrderPaymentAuthorization;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_OrderPaymentAuthorizationStatusUnknown.ToLower()))
            {
                return Paypal_OrderPaymentAuthorizationStatusUnknown;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_OrderPaymentAuthorizationIdNotFound.ToLower()))
            {
                return Paypal_OrderPaymentAuthorizationIdNotFound;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedCapturingOrderPayment.ToLower()))
            {
                return Paypal_FailedCapturingOrderPayment;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_CaptureOrderPaymentStatusUnknown.ToLower()))
            {
                return Paypal_CaptureOrderPaymentStatusUnknown;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_OrderPaymentCaptureIdNotFound.ToLower()))
            {
                return Paypal_OrderPaymentCaptureIdNotFound;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_OrderPaymentPaymentInfoIncomplete.ToLower()))
            {
                return Paypal_OrderPaymentPaymentInfoIncomplete;
            }

            if (formatErrorMessage.Equals(MessageHelper.NotAllowedToPurchaseOwnContent.ToLower()))
            {
                return NotAllowedToPurchaseOwnContent;
            }

            if (formatErrorMessage.Equals(MessageHelper.SubscriptionSettingsIsAllowedForCreatorUserOnly.ToLower()))
            {
                return SubscriptionSettingsIsAllowedForCreatorUserOnly;
            }

            if (formatErrorMessage.Equals(MessageHelper.CannotSubscribeToOwnAccount.ToLower()))
            {
                return CannotSubscribeToOwnAccount;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedCreatingLiveTicketOrder.ToLower()))
            {
                return Paypal_FailedCreatingLiveTicketOrder;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedCreatingSubscription.ToLower()))
            {
                return Paypal_FailedCreatingSubscription;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedGettingLiveTicketOrderUrl.ToLower()))
            {
                return Paypal_FailedGettingLiveTicketOrderUrl;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedGettingSubscriptionUrl.ToLower()))
            {
                return Paypal_FailedGettingSubscriptionUrl;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_SubscriptionUrlNotFound.ToLower()))
            {
                return Paypal_SubscriptionUrlNotFound;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_FailedGettingSubscriptionDetails.ToLower()))
            {
                return Paypal_FailedGettingSubscriptionDetails;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_SubscriptionStatusUnknown.ToLower()))
            {
                return Paypal_SubscriptionStatusUnknown;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_SubscriptionPaymentApprovalPending.ToLower()))
            {
                return Paypal_SubscriptionPaymentApprovalPending;
            }

            if (formatErrorMessage.Equals(MessageHelper.ArtistSubscriptionIsRequired.ToLower()))
            {
                return ArtistSubscriptionIsRequired;
            }

            if (formatErrorMessage.Equals(MessageHelper.PaidContentOptionOnlyForCreators.ToLower()))
            {
                return PaidContentOptionOnlyForCreators;
            }

            if (formatErrorMessage.Equals(MessageHelper.ExistingValidCouponCodeFound.ToLower()))
            {
                return ExistingValidCouponCodeFound;
            }

            if (formatErrorMessage.Equals(MessageHelper.AlreadyPurchasedLiveTicket.ToLower()))
            {
                return AlreadyPurchasedLiveTicket;
            }

            if (formatErrorMessage.Equals(MessageHelper.AlreadySubscribedToArtist.ToLower()))
            {
                return AlreadySubscribedToArtist;
            }

            if (formatErrorMessage.Equals(MessageHelper.LiveTicketsSold.ToLower()))
            {
                return LiveTicketsSold;
            }

            if (formatErrorMessage.Equals(MessageHelper.WaitingForPaymentConfirmation.ToLower()))
            {
                return WaitingForPaymentConfirmation;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_SubscriptionCancelFailed.ToLower()))
            {
                return Paypal_SubscriptionCancelFailed;
            }

            if (formatErrorMessage.Equals(MessageHelper.Paypal_SubscriptionSettingsNotFoundInDb.ToLower()))
            {
                return Paypal_SubscriptionSettingsNotFoundInDb;
            }

            if (formatErrorMessage.Equals(MessageHelper.ArtistAccountIsInactive.ToLower()))
            {
                return ArtistAccountIsInactive;
            }

            if (formatErrorMessage.Equals(MessageHelper.ArtistSubscriptionIsRequiredForLiveTicketSlot.ToLower()))
            {
                return ArtistSubscriptionIsRequiredForLiveTicketSlot;
            }


            if (formatErrorMessage.Equals(MessageHelper.FilPaymentGateway_WalletCreateResponseNull.ToLower()))
            {
                return FilPaymentGateway_WalletCreateResponseNull;
            }


            if (formatErrorMessage.Equals(MessageHelper.FilPaymentGateway_WalletCreateResponseNotRecognized.ToLower()))
            {
                return FilPaymentGateway_WalletCreateResponseNotRecognized;
            }


            if (formatErrorMessage.Equals(MessageHelper.FilPaymentGateway_WalletCreateResponseWalletAddressIsNull.ToLower()))
            {
                return FilPaymentGateway_WalletCreateResponseWalletAddressIsNull;
            }


            if (formatErrorMessage.Equals(MessageHelper.FilPaymentGateway_WalletCreateResponsePrivateKeyIsNull.ToLower()))
            {
                return FilPaymentGateway_WalletCreateResponsePrivateKeyIsNull;
            }




            return UndefinedErrorCode;

        }

    }

}
