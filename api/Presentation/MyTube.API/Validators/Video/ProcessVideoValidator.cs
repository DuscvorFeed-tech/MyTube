using FluentValidation;
using Microsoft.Extensions.Options;
using MyTube.API.Models.Video;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Services.Helpers.File;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;

namespace MyTube.API.Validators.Video
{
    public class ProcessVideoValidator : AbstractValidator<ProcessVideoModel>
    {

        private readonly VideoSettings_v2 _videoSettings;
        private readonly IWeRaveYouLog _logger;

        public ProcessVideoValidator(IWeRaveYouLog logger, ISysSettingsService sysSettingsService)
        {

            _logger = logger;

            var settings = sysSettingsService.GetSysSettingsList(SettingsType.VIDEO);
            _videoSettings = SysSettingsHelper.GetVideoSettings(settings, _logger);

            RuleFor(p => p.VideoFile)
                .NotNull()
                    .WithMessage(MessageHelper.Required);

            RuleFor(p => p)
                .Must(ValidVideoFile)
                    .WithName("VideoFile")
                    .WithMessage(MessageHelper.Invalid);

        }

        private bool ValidVideoFile(ProcessVideoModel model)
        {
            if (model.VideoFile != null)
            {

                if (model.VideoFile.Length > 0)
                {

                    return new FileHelper(_logger).IsUploadedVideoSupported(_videoSettings.GetSupportedFormat(), model.VideoFile);

                }

                return false;
            }

            return true;
        }

    }
}
