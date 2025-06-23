namespace MyTube.Core.Helpers.Lengths
{
    public static class LengthHelper
    {

        #region User

        public const int User_Username_MinLength = 4;
        public const int User_Username_MaxLength = 20;

        public const int User_Email_MaxLength = 50;

        public const int User_Password_MinLength = 8;
        public const int User_Password_MaxLength = 64;

        public const int User_PublicKey_MaxLength = 64;

        #endregion

        #region RegistrationCode

        public const int RegistrationCode_Key_MaxLength = 12;

        public const int RegistrationCode_ConfirmationCode_MaxLength = 32;

        #endregion

        #region EmailTemplate

        public const int EmailTemplate_Subject_MaxLength = 100;

        #endregion

        #region SnsAccount

        public const int SnsAccount_Instagram_MaxLength = 50;

        public const int SnsAccount_Facebook_MaxLength = 50;

        public const int SnsAccount_Twitter_MaxLength = 50;

        public const int SnsAccount_Youtube_MaxLength = 50;

        #endregion

        #region ZoomApp

        public const int ZoomApp_UserZoomId_MaxLength = 36;

        public const int ZoomApp_ApiKey_MaxLength = 36;

        public const int ZoomApp_ApiSecret_MaxLength = 36;

        #endregion

        #region PasswordReset

        public const int PasswordReset_Key_MaxLength = 12;

        public const int PasswordReset_ConfirmationCode_MaxLength = 64;

        public const int PasswordReset_ResetCode_MaxLength = 64;

        #endregion

        #region Video

        public const int Video_Title_MaxLength = 255;

        public const int Video_Hash_MaxLength = 64;

        public const int Video_Description_MaxLength = 1000;

        public const int Video_TransactionHash_MaxLength = 100;

        public const int Video_FileExtension_MaxLength = 5;

        #endregion

        #region VideoThumbnail

        public const int VideoThumbnail_Thumbnail_MaxLength = 64;
        public const int VideoThumbnail_Thumbnail1_MaxLength = 64;
        public const int VideoThumbnail_Thumbnail2_MaxLength = 64;
        public const int VideoThumbnail_Thumbnail3_MaxLength = 64;

        #endregion


        #region ZoomWebinar

        public const int ZoomWebinar_LiveName_MinLength = 5;
        public const int ZoomWebinar_LiveName_MaxLength = 100;

        public const int ZoomWebinar_Agenda_MaxLength = 250;
        public const int ZoomWebinar_Password_MaxLength = 10;

        public const int ZoomWebinar_YoutubeUrl_MaxLength = 100;

        #endregion

        #region ZoomWebinarPerformer

        public const int ZoomWebinarPerformer_Name_MaxLength = 50;

        #endregion


    }
}
