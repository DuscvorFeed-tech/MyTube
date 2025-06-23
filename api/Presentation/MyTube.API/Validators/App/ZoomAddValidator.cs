using FluentValidation;
using RestSharp.Extensions;
using MyTube.API.Models.App;
using MyTube.Core.Helpers.Lengths;
using MyTube.Services.Zoom;
using MyTube.Services.Helpers.Message;

namespace MyTube.API.Validators.App
{
    public class ZoomAddValidator : AbstractValidator<ZoomAddModel>
    {

        private readonly IZoomAppService _zoomAppService;

        public ZoomAddValidator(IZoomAppService zoomAppService)
        {

            _zoomAppService = zoomAppService;

            RuleFor(p => p.ApiKey)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MaximumLength(LengthHelper.ZoomApp_ApiKey_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.ApiSecret)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MaximumLength(LengthHelper.ZoomApp_ApiSecret_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p)
                .Must(ApiKeyAndApiSecretNotYetRegistered)
                    .WithMessage(MessageHelper.AlreadyRegistered)
                    .WithName("ApiKey|ApiSecret");

        }

        private bool ApiKeyAndApiSecretNotYetRegistered(ZoomAddModel model)
        {

            if(model.ApiKey.HasValue() && model.ApiSecret.HasValue())
            {

                return _zoomAppService.GetZoomAppCount(model.ApiKey, model.ApiSecret) == 0;

            }

            return true;

        }

    }
}
