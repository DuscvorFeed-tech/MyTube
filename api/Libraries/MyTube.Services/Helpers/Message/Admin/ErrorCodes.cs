namespace MyTube.Services.Helpers.Message.Admin
{
    public struct ErrorCodes
    {

        #region Default web status codes

        /// <summary>
        /// 201
        /// </summary>
        public static int Created = 201;

        /// <summary>
        /// 401
        /// </summary>
        public static int Unauthorized = 401;

        /// <summary>
        /// 404
        /// </summary>
        public static int NotFound = 404;

        /// <summary>
        /// 500
        /// </summary>
        public static int InternalServerError = 500;

        #endregion

        #region Internal server error codes

        public static string UndefinedErrorCode = "E0x00";

        #endregion

        #region Validation error codes

        public static string Invalid = "E0001";

        public static string Required = "E0002";

        public static string LessThanRequiredMinLength = "E0003";

        public static string MoreThanAllowedMaxLength = "E0004";

        #endregion

        #region DB record error codes

        public static string NoRecordFound = "E0030";

        public static string InvalidLoginCredentials = "E0031";

        public static string LiveNotForApproval = "E0032";

        public static string NotAllowedToUpdateRecord = "E0033";

        #endregion

        public static string GetErrorCode(string errorMessage)
        {
            var formatErrorMessage = errorMessage.ToLower();

            #region Validation 

            if (formatErrorMessage.Equals(MessageHelper.Invalid.ToLower()))
            {
                return Invalid;
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

            #endregion

            #region DB

            if (formatErrorMessage.Equals(MessageHelper.NoRecordFound.ToLower()))
            {
                return NoRecordFound;
            }

            if (formatErrorMessage.Equals(MessageHelper.InvalidLoginCredentials.ToLower()))
            {
                return InvalidLoginCredentials;
            }

            if (formatErrorMessage.Equals(MessageHelper.LiveNotForApproval.ToLower()))
            {
                return LiveNotForApproval;
            }

            if (formatErrorMessage.Equals(MessageHelper.NotAllowedToUpdateRecord.ToLower()))
            {
                return NotAllowedToUpdateRecord;
            }

            #endregion

            return UndefinedErrorCode;

        }

    }
}
