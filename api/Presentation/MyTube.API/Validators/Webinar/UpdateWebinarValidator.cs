using FluentValidation;
using Microsoft.AspNetCore.Http;
using System.Threading;
using System.Threading.Tasks;
using MyTube.API.Models.Webinar;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Helpers.Lengths;
using MyTube.Services.Zoom;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Webinar;

namespace MyTube.API.Validators.Webinar
{
    public class UpdateWebinarValidator : AbstractValidator<UpdateWebinarModel>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IWebinarService _webinarService;
        private readonly IZoomAppService _zoomAppService;

        public UpdateWebinarValidator(IHttpContextAccessor contextAccessor, IWebinarService webinarService, 
                                        IZoomAppService zoomAppService)
        {

            _contextAccessor = contextAccessor;
            _webinarService = webinarService;
            _zoomAppService = zoomAppService;

            RuleFor(p => p.YoutubeUrl)
                .Cascade(CascadeMode.Stop)
                .MaximumLength(LengthHelper.ZoomWebinar_LiveName_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p)
                .MustAsync(WebinarRegisteredOnLoggedUserUser)
                    .WithName("Id")
                    .WithMessage(MessageHelper.NoRecordFound);

        }

        private async Task<bool> WebinarRegisteredOnLoggedUserUser(UpdateWebinarModel model, CancellationToken arg)
        {

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                var zoomApp = await _zoomAppService.GetZoomAppAsync(user.Id, true, user.UserType == UserType.Creator ? true : false);
                if (zoomApp != null)
                {
                    var zoomWebinarCount = await _webinarService.GetWebinarCountAsync(model.Id, zoomApp.Id);
                    return zoomWebinarCount == 1;
                }
            }

            return false;

        }

    }
}
