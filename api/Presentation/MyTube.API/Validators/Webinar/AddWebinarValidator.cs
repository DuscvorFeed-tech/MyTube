using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using MyTube.API.Models.Webinar;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Helpers.Lengths;
using MyTube.Services.Zoom;
using MyTube.Services.CommonType;
using MyTube.Services.Helpers.File;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Webinar;
using MyTube.Services.Zoom.Webinar;
using MyTube.Services.SysSettings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Core.Domain.SysSettings.Enums;

namespace MyTube.API.Validators.Webinar
{
    public class AddWebinarValidator : AbstractValidator<AddWebinarModel>
    {

        private readonly IWeRaveYouLog _logger;
        private readonly IWebinarService _webinarService;
        private readonly ImageSettings_v2 _imageSettings;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IZoomAppService _zoomAppService;
        private readonly ICommonTypeService _commonTypeService;

        public AddWebinarValidator(IWeRaveYouLog logger, IWebinarService webinarService,
                                    IHttpContextAccessor contextAccessor,
                                    IZoomAppService zoomAppService, ICommonTypeService commonTypeService,
                                    ISysSettingsService sysSettingsService)
        {

            _logger = logger;
            _webinarService = webinarService;

            var settings = sysSettingsService.GetSysSettingsList(SettingsType.IMAGE);
            _imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);

            _contextAccessor = contextAccessor;
            _zoomAppService = zoomAppService;
            _commonTypeService = commonTypeService;

            RuleFor(p => p)
                .Must(UserHasZoomApp)
                    .WithName("User")
                    .WithMessage(MessageHelper.UserDoesNotHaveRegisteredZoomApp);

            RuleFor(p => p.LiveName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MinimumLength(LengthHelper.ZoomWebinar_LiveName_MinLength)
                    .WithMessage(MessageHelper.LessThanRequiredMinLength)
                .MaximumLength(LengthHelper.ZoomWebinar_LiveName_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.AnnouncementImage)
                .Cascade(CascadeMode.Stop)
                .Must(AnnouncementImageNotNull)
                    .WithMessage(MessageHelper.Required)
                .Must(AnnouncementImageMustValid)
                    .WithMessage(MessageHelper.Invalid);


            RuleFor(p => p.WebinarStart)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(WebinarStartNotPastDate)
                    .WithMessage(MessageHelper.MustBeFutureDate)
                .Must(WebinarStartNotDuplicate)
                    .WithMessage(MessageHelper.AlreadyRegistered);


            RuleFor(p => p.DurationHour)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(DurationHourValid)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.DurationMinute)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(DurationMinuteValid)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p)
                .Must(DurationHourNotMoreThan24Hours)
                    .WithName("DurationHour")
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p)
                .Must(DurationHourAndMinuteAtLeast15Minutes)
                    .WithName("DurationMinute")
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.Performer)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required);

            RuleForEach(p => p.Performer)
                .NotNull()
                    .WithMessage(MessageHelper.Required)
                .MaximumLength(LengthHelper.ZoomWebinarPerformer_Name_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.VideoType)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(VideoTypeValid)
                    .WithMessage(MessageHelper.Invalid);


            RuleFor(p => p.TopPageAnnouncement)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required);


            RuleFor(p => p.YoutubeLive)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required);

            RuleFor(p => p.PaidContent)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required);

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
                .GreaterThan(0)
                    .When(p => p.PaidContentFilPrice != null)
                    .WithMessage(MessageHelper.MustBeGreaterThan);

            RuleFor(p => p.LiveTicket)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required);

            RuleFor(p => p.LiveTicketPrice)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .When(p => p.LiveTicket == true)
                    .WithMessage(MessageHelper.Required)
                .GreaterThan(0)
                    .When(p => p.LiveTicket == true)
                    .WithMessage(MessageHelper.MustBeGreaterThan);

            RuleFor(p => p.LiveTicketFilPrice)
                .Cascade(CascadeMode.Stop)
                .GreaterThan(0)
                    .When(p => p.PaidContentFilPrice != null)
                    .WithMessage(MessageHelper.MustBeGreaterThan);

            RuleFor(p => p.MaxLiveTicket)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .When(p => p.LiveTicket == true)
                    .WithMessage(MessageHelper.Required)
                .GreaterThan(0)
                    .When(p => p.LiveTicket == true)
                    .WithMessage(MessageHelper.MustBeGreaterThan);

            RuleFor(p => p.Agenda)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(LengthHelper.ZoomWebinar_Agenda_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.YoutubeUrl)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(LengthHelper.ZoomWebinar_LiveName_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

        }

        private bool WebinarStartNotDuplicate(DateTime? webinarStart)
        {
            if (webinarStart.HasValue)
            {

                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user != null)
                {

                    if (user.UserType == UserType.Creator)
                    {

                        if(user.ZoomApp != null && (user.ZoomApp.UserZoomId != null && user.ZoomApp.ApiKey != null && user.ZoomApp.ApiSecret != null))
                        {
                            return _webinarService.GetWebinarCount(user.ZoomApp.Id, webinarStart, WebinarIdFilterType.ZoomAppId) == 0;
                        }
                        else
                        {
                            return _webinarService.GetWebinarCount(user.Id, webinarStart, WebinarIdFilterType.CreatedBy) == 0;
                        }

                    }

                }


            }

            return true;
        }

        private bool DurationHourAndMinuteAtLeast15Minutes(AddWebinarModel model)
        {
            if (model.DurationHour.HasValue && model.DurationHour.HasValue)
            {
                if (model.DurationHour == 0)
                {
                    return model.DurationMinute != 0;
                }
            }

            return true;
        }

        private bool DurationHourNotMoreThan24Hours(AddWebinarModel model)
        {
            if(model.DurationHour.HasValue && model.DurationHour.HasValue)
            {
                if(model.DurationHour == 24)
                {
                    return model.DurationMinute == 0;
                }
            }

            return true;
        }

        private bool DurationMinuteValid(int? id)
        {
            return _commonTypeService.GetCommonTypeCount(Core.Domain.CommonType.CommonTypeList.WebinarDurationMinute, (int)id) == 1;
        }

        private bool DurationHourValid(int? id)
        {
            return _commonTypeService.GetCommonTypeCount(Core.Domain.CommonType.CommonTypeList.WebinarDurationHour, (int)id) == 1;
        }

        private bool WebinarStartNotPastDate(DateTime? webinarStart)
        {
            if(webinarStart.HasValue)
            {

                return !(Convert.ToDateTime(webinarStart?.ToString("yyyyy-MM-dd HH:mm")) <= Convert.ToDateTime(DateTime.Now.AddHours(1).ToString("yyyyy-MM-dd HH:mm")));

            }

            return true;

        }

        private bool UserHasZoomApp(AddWebinarModel model)
        {

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if(user != null)
            {

                if (user.UserType == UserType.Basic)
                {
                    return _zoomAppService.GetZoomAppCount(user.Id, true) == 1;
                }

                return _zoomAppService.GetZoomAppCount(UserType.Creator) >= 1;

            }

            return true;
        }

        private bool AnnouncementImageNotNull(IFormFile file)
        {
            if(file == null)
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

        private bool VideoTypeValid(int? id)
        {
            return _commonTypeService.GetCommonTypeCount(Core.Domain.CommonType.CommonTypeList.VideoType, (int)id) == 1;
        }


    }
}
