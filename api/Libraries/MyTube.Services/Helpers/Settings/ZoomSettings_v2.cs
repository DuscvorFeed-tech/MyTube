using System.IO;

namespace MyTube.Services.Helpers.Settings
{
    public class ZoomSettings_v2
    {

        public string Url { get; set; }

        #region Token expiration

        public int GetUserZoomIdTokenExpiration { get; set; }

        public int CreateWebinarTokenExpiration { get; set; }

        public int WebinarZoomRecordingDownloaderCronTokenExpiration { get; set; }

        public int WebinarZoomRecordingFetcherCronTokenExpiration { get; set; }

        public int DeleteWebinarTokenExpiration { get; set; }

        public int WebinarZoomStartUrlTokenValidatorCronTokenExpiration { get; set; }

        #endregion

        #region Routes

        public string DeleteWebinarRoute { get; set; }

        public string ListAllRecordingsRoute { get; set; }

        public string ListUsersRoute { get; set; }

        public string ListWebinarsRoute { get; set; }

        public string UpdateWebinarRoute { get; set; }

        public string WebinarDetailRoute { get; set; }

        #endregion

        public string GetDeleteWebinarUrl(long Zoom_id)
        {
            return string.Format("{0}{1}", Url, string.Format(DeleteWebinarRoute, Zoom_id));
        }

        public string GetListAllRecordingsUrl()
        {
            return string.Format("{0}{1}", Url, ListAllRecordingsRoute);
        }

        public string GetListUsersUrl()
        {
            return string.Format("{0}{1}", Url, ListUsersRoute);
        }

        public string GetListWebinarsUrl()
        {
            return string.Format("{0}{1}", Url, ListWebinarsRoute);
        }

        public string GetUpdateWebinarUrl()
        {
            return string.Format("{0}{1}", Url, UpdateWebinarRoute);
        }

        public string GetWebinarDetailUrl(long Zoom_id)
        {
            return string.Format("{0}{1}", Url, string.Format(WebinarDetailRoute, Zoom_id));
        }

        public string WebhookAuthorization { get; set; }

        public string WebinarStartEvent { get; set; }

        public string WebinarEndEvent { get; set; }

        public int FetchRecordingsForTheLast { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="downloadFolder">AppSettings.DownloadFolder</param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public string GetDownloadTempFolder(string downloadFolder, long userId)
        {

            string folderPath = string.Format("{0}{1}/zoom/video/temp/", downloadFolder, userId);

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            return folderPath;

        }

        public string GetDownloadFolder(string downloadFolder, long userId)
        {

            string folderPath = string.Format("{0}{1}/zoom/video/", downloadFolder, userId);

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            return folderPath;

        }

    }
}
