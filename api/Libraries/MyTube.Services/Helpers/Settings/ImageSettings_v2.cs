using System;

namespace MyTube.Services.Helpers.Settings
{
    public class ImageSettings_v2
    {

        public string ServerUrl { get; set; }

        public string SupportedFormat { get; set; }

        public string[] GetSuppoprtedFormat()
        {
            return this.SupportedFormat.Split(',');
        }

        public string GetWebinarTempFolder(string uploadFolder, long userId)
        {
            return string.Format("{0}{1}/temp/webinar/", uploadFolder, userId);
        }

        public string GetProfilePictureTempFolder(string uploadFolder, long userId)
        {
            return string.Format("{0}{1}/temp/profile_picture/", uploadFolder, userId);
        }

        public string VideoThumbnailSize { get; set; }

        public string WebinarThumbnailSize { get; set; }
        
        public string ProfilePictureMaxFileSize { get; set; }

        public long? GetProfilePictureMaxFileSizeAllowed()
        {
            return GetAllowedFileSize(ProfilePictureMaxFileSize);
        }

        private long? GetAllowedFileSize(string value)
        {
            //  Format {size (int)}|{MB or GB}
            var values = value.Split('|');
            if (values.Length == 2)
            {

                try
                {
                    int size = Convert.ToInt32(values[0]);
                    if (size > 0)
                    {
                        long allowedSize = size * 1024;

                        allowedSize = allowedSize * 1024;

                        if (values[1].Equals("gb", StringComparison.OrdinalIgnoreCase))
                        {
                            allowedSize = allowedSize * 1024;
                        }

                        return allowedSize;
                    }
                }
                catch
                {

                }
            }

            return null;

        }


    }
}
