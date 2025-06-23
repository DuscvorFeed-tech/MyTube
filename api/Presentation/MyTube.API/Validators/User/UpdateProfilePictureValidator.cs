using FluentValidation;
using Microsoft.AspNetCore.Http;
using MyTube.API.Models.User;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Services.Helpers.File;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;

namespace MyTube.API.Validators.User
{
    public class UpdateProfilePictureValidator : AbstractValidator<UpdateProfilePictureModel>
    {
        private readonly IWeRaveYouLog _logger;
        private readonly ImageSettings_v2 _imageSettings;

        public UpdateProfilePictureValidator(IWeRaveYouLog logger, ISysSettingsService sysSettingsService)
        {

            _logger = logger;

            var settings = sysSettingsService.GetSysSettingsList(SettingsType.IMAGE);
            _imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);

            RuleFor(p => p.ProfileImage)
                .Cascade(CascadeMode.Stop)
                .Must(AnnouncementImageNotNull)
                    .WithMessage(MessageHelper.Required)
                .Must(AnnouncementImageMustValid)
                    .WithMessage(MessageHelper.Invalid)
                .Must(FileSizeNotMoreThanAllowedFileSize)
                    .WithMessage(MessageHelper.FileSizeMoreThanMaximumAllowed);
        }

        private bool AnnouncementImageNotNull(IFormFile file)
        {
            if (file == null)
            {
                return false;
            }

            return file.Length != 0;
        }

        private bool AnnouncementImageMustValid(IFormFile file)
        {
            if (file != null)
            {

                if (file.Length > 0)
                {

                    return new FileHelper(_logger).IsUploadedCustomVideoThumbnailSupported(_imageSettings.GetSuppoprtedFormat(), file);

                }

                return false;

            }

            return true;
        }

        private bool FileSizeNotMoreThanAllowedFileSize(IFormFile file)
        {
            if (_imageSettings != null)
            {
                var allowedSize = _imageSettings.GetProfilePictureMaxFileSizeAllowed();
                if (allowedSize.HasValue == false)
                {
                    _logger.Error("File maximum file size allowed value is not valid. Format should be {size (int)}|{MB or GB}");
                    return false;
                }

                return file.Length <= allowedSize;

            }

            return false;

        }

    }
}
