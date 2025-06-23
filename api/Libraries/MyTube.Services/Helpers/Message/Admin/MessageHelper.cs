namespace MyTube.Services.Helpers.Message.Admin
{
    public static class MessageHelper
    {

        #region Validation error codes

        public readonly static string Invalid = "Invalid";

        public readonly static string Required = "Required";

        public readonly static string LessThanRequiredMinLength = "Less than required min length";

        public readonly static string MoreThanAllowedMaxLength = "More than allowed max length";

        #endregion

        #region DB record error codes

        public readonly static string NoRecordFound = "No record found";

        public readonly static string InvalidLoginCredentials = "Cannot authenticate user";

        public readonly static string LiveNotForApproval = "Live is not for approval";

        public readonly static string NotAllowedToUpdateRecord = "Not allowed to update this record";

        #endregion


    }
}
