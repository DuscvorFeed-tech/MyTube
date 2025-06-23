namespace MyTube.Services.Helpers.Settings
{
    public class VideoSettings_v2
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="uploadFolder">AppSettings.UploadFolder</param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public string GetUploadTempFolder(string uploadFolder, long userId)
        {
            return string.Format("{0}{1}/video/temp/", uploadFolder, userId);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="uploadFolder">AppSettings.UploadFolder</param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public string GetUploadFolder(string uploadFolder, long userId)
        {
            return string.Format("{0}{1}/video/", uploadFolder, userId);
        }

        public string ServerUrl { get; set; }

        public string SupportedFormat { get; set; }

        public string[] GetSupportedFormat()
        {
            return this.SupportedFormat.Split(',');
        }

        public string SuppoprtedThumbnailFormat { get; set; }

        public string[] GetSuppoprtedThumbnailFormat()
        {
            return this.SuppoprtedThumbnailFormat.Split(',');
        }


    }
}
