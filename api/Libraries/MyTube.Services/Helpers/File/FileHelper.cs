using Microsoft.AspNetCore.Http;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Helpers.File
{
    public class FileHelper
    {

        private readonly IWeRaveYouLog _logger;

        public FileHelper(IWeRaveYouLog logger)
        {
            _logger = logger;
        }

        public bool IsUploadedVideoSupported(string[] supportedVideoFormat, IFormFile vidoFile)
        {
            return this.IsFileSupported(supportedVideoFormat, "video", vidoFile);
        }

        public bool IsUploadedCustomVideoThumbnailSupported(string[] supportedVideoFormat, IFormFile imageFile)
        {
            return this.IsFileSupported(supportedVideoFormat, "image", imageFile);
        }

        private bool IsFileSupported(string[] supportedFormat, string fileType, IFormFile file)
        {
            if (supportedFormat.Where(i => (fileType + "/" + i) == file.ContentType).Count() == 1)
            {
                return true;
            }

            return false;
        }

        public async Task<string> Upload(IFormFile file, string folder)
        {
            string fileName = null;

            if (file != null)
            {
                try
                {

                    if (Directory.Exists(folder) == false)
                    {
                        Directory.CreateDirectory(folder);
                    }

                    if (Directory.Exists(folder) == true)
                    {

                        string extension = Path.GetExtension(file.FileName);
                        fileName = Guid.NewGuid() + extension;

                        var filePath = Path.Combine(folder, fileName);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(fileStream);
                        }
                    }

                    return fileName;

                }
                catch (Exception ex)
                {
                    _logger.Error($"While tyring to upload file: {ex}");
                    _logger.Debug($"FileName={file.FileName} FileSize={file.Length} ServerPath={folder}");
                }
            }

            return fileName;

        }

        internal object GenerateThumbnails(string videoFilename, string folder, string ffmpegAppPath, string thumbnailSize)
        {
            string videoFile = (folder + videoFilename);
            if (System.IO.File.Exists(videoFile))
            {

                TimeSpan duration = GetVideoDuration(videoFile, ffmpegAppPath);
                if ((duration.Hours == 0 && duration.Minutes == 0 && duration.Seconds == 0) == false)
                {

                    var fiftyPercent = new TimeSpan(duration.Ticks / 2);
                    var twentyFivePercent = new TimeSpan(fiftyPercent.Ticks / 2);
                    var seventyFivePercent = new TimeSpan(fiftyPercent.Ticks / twentyFivePercent.Ticks);

                    string t1 = this.GenerateVideoThumbnail(videoFile, folder, twentyFivePercent, ffmpegAppPath, thumbnailSize);
                    if (t1.HasValue() == false)
                    {
                        return null;
                    }

                    string t2 = this.GenerateVideoThumbnail(videoFile, folder, fiftyPercent, ffmpegAppPath, thumbnailSize);
                    if (t2.HasValue() == false)
                    {
                        return null;
                    }

                    string t3 = this.GenerateVideoThumbnail(videoFile, folder, seventyFivePercent, ffmpegAppPath, thumbnailSize);
                    if (t3.HasValue() == false)
                    {
                        return null;
                    }

                    string[] thumbnails =
                    {
                        t1, t2, t3
                    };

                    return thumbnails;

                }

            }

            return null;

        }

        public TimeSpan GetVideoDuration(string videoFile, string ffmpegAppPath)
        {

            TimeSpan duration = new TimeSpan(0, 0, 0);

            string param = string.Format("-i \"{0}\"", videoFile);

            var processStartInfo = new ProcessStartInfo(ffmpegAppPath, param)
            {
                CreateNoWindow = true,
                RedirectStandardError = true,
                WindowStyle = ProcessWindowStyle.Hidden,
                UseShellExecute = false
            };

            var regexDuration = new Regex("[D|d]uration:.((\\d|:|\\.)*)");

            var process = Process.Start(processStartInfo);

            StreamReader streamReader = process.StandardError;

            string outPut = streamReader.ReadToEnd();

            process.WaitForExit();
            process.Close();
            process.Dispose();

            streamReader.Close();
            streamReader.Dispose();

            var regexMatch = regexDuration.Match(outPut);
            if (regexMatch.Success)
            {
                //Means the output has cantained the string "Duration"
                string temp = regexMatch.Groups[1].Value;

                string[] timepieces = temp.Split(new char[] { ':', '.' });
                if (timepieces.Length == 4)
                {
                    // Store duration
                    duration = new TimeSpan(0, Convert.ToInt16(timepieces[0]), Convert.ToInt16(timepieces[1]), Convert.ToInt16(timepieces[2]), Convert.ToInt16(timepieces[3]));
                }
            }

            return duration;

        }

        private string GenerateVideoThumbnail(string videoFile, string thumbnailFolder, TimeSpan ts, string ffmpegAppPath, string videoThumbnailSize)
        {

            try
            {
                string thumbnailFileName = Guid.NewGuid() + ".png";

                string param = string.Format("-ss {0} -i {1} -s {2} -f image2 -vframes 1 -y {3} ", ts, "\"" + videoFile + "\"", videoThumbnailSize, "\"" + thumbnailFolder + thumbnailFileName + "\"");

                var processStartInfo = new ProcessStartInfo(ffmpegAppPath, param)
                {
                    CreateNoWindow = true,
                    RedirectStandardError = true,
                    WindowStyle = ProcessWindowStyle.Hidden,
                    UseShellExecute = false
                };

                using (var process = new Process())
                {
                    process.StartInfo = processStartInfo;
                    process.Start();
                    process.WaitForExit();
                }

                if (System.IO.File.Exists(thumbnailFolder + thumbnailFileName))
                {
                    return thumbnailFileName;
                }

                _logger.Error($"Cannot generate thumbnails: {param}");
                return null;

            }
            catch (Exception ex)
            {
                _logger.Error($"GenerateVideoThumbnail: {ex}");
                return null;
            }

        }

        public async Task<byte[]> ReadFileAsBytes(string fileName, string folder)
        {
            string file = folder + fileName;

            if (System.IO.File.Exists(file))
            {
                return await System.IO.File.ReadAllBytesAsync(file);
            }

            return null;

        }

        public string ResizeImage(string imageFile, string folder, string ffmpegAppPath, string imageSize)
        {

            try
            {
                string newFileName = Guid.NewGuid() + ".png";

                string scale = imageSize.Replace('x', ':');

                string param = string.Format("-i {0} -vf scale={1} {2}", "\"" + Path.Combine(folder, imageFile) + "\"", scale, "\"" + Path.Combine(folder, newFileName) + "\"");

                var processStartInfo = new ProcessStartInfo(ffmpegAppPath, param)
                {
                    CreateNoWindow = true,
                    RedirectStandardError = true,
                    WindowStyle = ProcessWindowStyle.Hidden,
                    UseShellExecute = false
                };

                using (var process = new Process())
                {
                    process.StartInfo = processStartInfo;
                    process.Start();
                    process.WaitForExit();
                }

                return newFileName;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to resize image: {ex}");
                _logger.Debug($"File={imageFile} Folder={folder} FfmpegPath={ffmpegAppPath} FileSize={imageSize}");
                return null;
            }

        }

        public string GetFileExtension(string file)
        {

            if (System.IO.File.Exists(file))
            {
                string extension = Path.GetExtension(file);
                if (extension.HasValue())
                {
                    return extension.Replace(".", "").ToLower();
                }
            }

            return null;

        }

        public long GetFileSize(string file)
        {
            var fi = new FileInfo(file);
            if (fi.Exists)
            {
                return fi.Length;
            }

            return 0;

        }

        public void MoveFile(string sourceFile, string destinationFile, bool deleteDestinationFile = true)
        {
            if (System.IO.File.Exists(sourceFile))
            {
                System.IO.File.Copy(sourceFile, destinationFile, true);

                if (deleteDestinationFile)
                {
                    if (System.IO.File.Exists(destinationFile))
                    {
                        System.IO.File.Delete(sourceFile);
                    }
                }
            }
        }


    }
}
