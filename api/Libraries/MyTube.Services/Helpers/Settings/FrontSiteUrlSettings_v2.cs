namespace MyTube.Services.Helpers.Settings
{
    public class FrontSiteUrlSettings_v2
    {

        public string FrontSiteUrl { get; set; }

        public string SignUpConfirmationUrl { get; set; }

        public string GetSignUpConfirmationUrl
        {
            get
            {
                return string.Format("{0}{1}", FrontSiteUrl, SignUpConfirmationUrl);
            }
        }

        public string ForgotPasswordConfirmationUrl { get; set; }

        public string GetForgotPasswordConfirmationUrl
        {
            get
            {
                return string.Format("{0}{1}", FrontSiteUrl, ForgotPasswordConfirmationUrl);
            }
        }

        public string WatchPaidContentVideoUrl { get; set; }

        public string GetWatchPaidContentVideoUrl
        {
            get
            {
                return string.Format("{0}{1}", FrontSiteUrl, WatchPaidContentVideoUrl);
            }
        }

        public string ArtistPageUrl { get; set; }

        public string GetArtistPageUrl
        {
            get
            {
                return string.Format("{0}{1}", FrontSiteUrl, ArtistPageUrl);
            }
        }

        public string ArtistProfileRoute { get; set; }

        public string MyPageRoute { get; set; }

        public string UserProfileRoute { get; set; }

        public string WebinarScheduleLiveRoute { get; set; }

    }
}
