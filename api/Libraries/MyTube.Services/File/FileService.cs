using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.Helpers.File;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;
using MyTube.Services.Video;

namespace MyTube.Services.File
{
    public class FileService : IFileService
    {
        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly AppSettings _appSettings;
        private readonly VideoSettings_v2 _videoSettings;
        private readonly ImageSettings_v2 _imageSettings;
        private readonly IVideoService _videoService;

        public FileService(DataContext dataContext, IWeRaveYouLog logger,
                            IOptions<AppSettings> appSettings,
                            IVideoService videoService, ISysSettingsService sysSettingsService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _appSettings = appSettings.Value;
            _videoService = videoService;

            var settings = sysSettingsService.GetSysSettingsList();
            _videoSettings = SysSettingsHelper.GetVideoSettings(settings, _logger);
            _imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);

        }

        public async Task<object> Upload(long userId, IFormFile videoFile)
        {

            string videoFolder = _videoSettings.GetUploadTempFolder(_appSettings.UploadFolder, userId);

            var fileHelper = new FileHelper(_logger);

            var fileName = await fileHelper.Upload(videoFile, videoFolder);
            if (fileName.HasValue())
            {
                var thumbnails = fileHelper.GenerateThumbnails(fileName, videoFolder, _appSettings.FfmpegAppPath, _imageSettings.VideoThumbnailSize);
                if (thumbnails != null)
                {
                    
                    var data = new Dictionary<string, object>
                    {
                        { "videoFileName", fileName },
                        { "thumbnails", thumbnails },
                    };

                    return new SuccessResponse(data);

                }
                else
                {
                    return new ErrorResponse("VideoFile", MessageHelper.FailedGeneratingThumbnails, ErrorCodes.FailedGeneratingThumbnails);
                }
            }
            else
            {
                return new ErrorResponse("VideoFile", MessageHelper.FailedUploadingFileToServer, ErrorCodes.FailedGeneratingThumbnails);
            }

        }

        public async Task<object> GetVideoThumbnail(long userId, string thumbnail)
        {
            
            string thumbnailFolder = _videoSettings.GetUploadTempFolder(_appSettings.UploadFolder, userId);

            var fileHelper = new FileHelper(_logger);

            var bytes = await fileHelper.ReadFileAsBytes(thumbnail, thumbnailFolder);
            if (bytes != null)
            {
                return bytes;
            }

            return null;
        }

        public async Task<object> GetPayPerViewVideo(long userId, string couponCode, string paidContentHash, bool owner, bool subscriber)
        {

            try
            {

                long userIdVideoOwner = userId;
                string hash = "";
                string fileExtension = "";

                if (owner == false)
                {

                    if (subscriber == true)
                    {

                        var video = _videoService.GetVideoForSubscriber(paidContentHash, userId);
                        if(video == null)
                        {
                            return null;
                        }

                        userIdVideoOwner = video.UserId;
                        hash = video.Hash;
                        fileExtension = video.FileExtension;
                    }
                    else
                    {

                        var record = await _dataContext.Purchases.AsNoTracking()
                                            .Include(e => e.Coupon)
                                            .Include(e => e.Video)
                                            .Where(p =>
                                                        p.UserId == userId &&
                                                        p.Coupon.CouponCode == couponCode &&
                                                        p.Coupon.Active == true &&
                                                        p.Coupon.DateActivated != null &&
                                                        p.Coupon.Expired == false &&
                                                        p.Video.PaidContentHash == paidContentHash &&
                                                        p.Video.PaidContent == true)
                                            .SingleOrDefaultAsync();

                        if (record == null)
                        {
                            return null;
                        }

                        userIdVideoOwner = record.Video.UserId;
                        hash = record.Video.Hash;
                        fileExtension = record.Video.FileExtension;
                    }

                }
                else
                {

                    var record = await _dataContext.Videos.AsNoTracking()
                                            .Where(p =>
                                                        p.UserId == userId &&
                                                        p.PaidContentHash == paidContentHash &&
                                                        p.PaidContent == true)
                                            .SingleOrDefaultAsync();

                    if (record == null)
                    {
                        return null;
                    }

                    hash = record.Hash;
                    fileExtension = record.FileExtension;

                }

                var folder = _videoSettings.GetUploadFolder(_appSettings.UploadFolder, userIdVideoOwner);
                var fileName = hash + "." + fileExtension;

                var fileHelper = new FileHelper(_logger);

                var bytes = await fileHelper.ReadFileAsBytes(fileName, folder);
                if (bytes != null)
                {
                    return bytes;
                }

            }
            catch (Exception ex)
            {
                if (owner == false)
                {
                    _logger.Error($"While trying to get record count from paypal_payperview_order table: {ex}");
                    _logger.Debug($"WHERE UserId={userId} AND purchase_coupon.CouponCode={couponCode} AND video.PaidContentHash={paidContentHash} AND video.PaidContent=1");
                }
                else
                {
                    _logger.Error($"While trying to get record count from video table: {ex}");
                    _logger.Debug($"WHERE UserId={userId} AND video.PaidContentHash={paidContentHash} AND video.PaidContent=1");
                }
            }

            return null;

        }

    }
}
