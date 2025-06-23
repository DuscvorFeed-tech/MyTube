using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using MyTube.API.Models.Video;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Core.Helpers.Lengths;
using MyTube.Services.CommonType;
using MyTube.Services.Helpers.File;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;

namespace MyTube.API.Validators.Video
{
    public class UploadVideoValidator : AbstractValidator<UploadVideoModel>
    {

        private readonly VideoSettings_v2 _videoSettings;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IWeRaveYouLog _logger;
        private readonly ICommonTypeService _commonTypeService;
        private readonly AppSettings _appSettings;

        public UploadVideoValidator(IHttpContextAccessor contextAccessor, 
                                    IWeRaveYouLog logger, ICommonTypeService commonTypeService,
                                    IOptions<AppSettings> appSettings, ISysSettingsService sysSettingsService)
        {

            _contextAccessor = contextAccessor;
            _logger = logger;
            _commonTypeService = commonTypeService;
            _appSettings = appSettings.Value;

            var settings = sysSettingsService.GetSysSettingsList(SettingsType.VIDEO);
            _videoSettings = SysSettingsHelper.GetVideoSettings(settings, _logger);

            RuleFor(p => p.VideoFileName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(VideoFileExistInServer)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.VideoType)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(VideoTypeMustValid)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.Thumbnail1)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(VideoThumbnailMustExistInServer)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.Thumbnail2)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(VideoThumbnailMustExistInServer)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.Thumbnail3)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(VideoThumbnailMustExistInServer)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.Title)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MaximumLength(LengthHelper.Video_Title_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.Description)
                .MaximumLength(LengthHelper.Video_Description_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.VideoThumbnail)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .When(p => p.CustomVideoThumbnail == null)
                    .WithMessage(MessageHelper.Required);

            RuleFor(p => p)
                .Must(VideoThumbnailMustExistInTheList)
                    .WithName("VideoThumbnail")
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.CustomVideoThumbnail)
                .Must(CustomVideoThumbnailMustValid)
                    .When(p => p.CustomVideoThumbnail != null)
                        .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.PaidContent)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(UserAllowedForPaidContent)
                    .WithMessage(MessageHelper.PaidContentOptionOnlyForCreators);

            RuleFor(p => p.PaidContentPrice)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .When(p => p.PaidContent == true)
                    .WithMessage(MessageHelper.Required)
                .GreaterThan(0)
                    .When(p => p.PaidContent == true)
                    .WithMessage(MessageHelper.MustBeGreaterThan);

            RuleFor(p => p.PaidContentFilPrice)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .When(p => p.PaidContent == true)
                    .WithMessage(MessageHelper.Required);
        }

        private bool UserAllowedForPaidContent(bool? paidContent)
        {
            if(paidContent == true)
            {

                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user != null)
                {
                    return user.UserType == Core.Domain.User.Enums.UserType.Creator;
                }

                return false;

            }

            return true;

        }

        private bool CustomVideoThumbnailMustValid(IFormFile file)
        {
            if (file != null)
            {

                if (file.Length > 0)
                {

                    return new FileHelper(_logger).IsUploadedCustomVideoThumbnailSupported(_videoSettings.GetSuppoprtedThumbnailFormat(), file);

                }

                return false;
            }

            return true;

        }

        private bool VideoTypeMustValid(int? id)
        {

            if (id.HasValue())
            {
                return _commonTypeService.GetCommonTypeCount(Core.Domain.CommonType.CommonTypeList.VideoType, (int)id) == 1;
            }

            return true;

        }

        private bool VideoThumbnailMustExistInServer(string thumbnail)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                return System.IO.File.Exists(_videoSettings.GetUploadTempFolder(_appSettings.UploadFolder, user.Id) + thumbnail);
            }

            return false;
        }

        private bool VideoFileExistInServer(string videoFileName)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {

                return System.IO.File.Exists(_videoSettings.GetUploadTempFolder(_appSettings.UploadFolder, user.Id) + videoFileName);

            }

            return false;
        }

        private bool VideoThumbnailMustExistInTheList(UploadVideoModel model)
        {

            if (model.VideoThumbnail.HasValue() && (model.Thumbnail1.HasValue() && model.Thumbnail2.HasValue() && model.Thumbnail3.HasValue()))
            {

                if (model.VideoThumbnail == model.Thumbnail1)
                {
                    return true;
                }
                else if (model.VideoThumbnail == model.Thumbnail2)
                {
                    return true;
                }
                else if (model.VideoThumbnail == model.Thumbnail3)
                {
                    return true;
                }
                else
                {
                    if (model.CustomVideoThumbnail == null)
                    {
                        return false;
                    }
                }

            }

            return true;

        }

    }
}
