using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Helpers.Download
{
    public class DownloadHelper
    {

        private readonly IWeRaveYouLog _logger;

        public DownloadHelper(IWeRaveYouLog zoomcordingLog)
        {
            _logger = zoomcordingLog;
        }

        /// <summary>
        /// Used to download file from url
        /// </summary>
        /// <param name="url">Website URL</param>
        /// <param name="file">Local file to be created for the downloaded file</param>
        /// <returns>Returns true if success, otherwise false.</returns>
        public async Task<bool> DownloadFileAsync(string url, string file)
        {

            bool status = false;

            try
            {

                if(System.IO.File.Exists(file))
                {
                    System.IO.File.Delete(file);
                }    

                using (var client = new HttpClient())
                {

                    var response = await client.GetAsync(url);

                    using (var stream = await response.Content.ReadAsStreamAsync())
                    {
                        var fileInfo = new FileInfo(file);
                        using (var fileStream = fileInfo.OpenWrite())
                        {
                            await stream.CopyToAsync(fileStream);
                        }
                    }

                }

                status = System.IO.File.Exists(file);

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to download file from zoom api: {ex}");
                _logger.Debug($"DownloadUrl={url} SaveToLocalFile={file}");

            }

            return status;

        }

    }
}
