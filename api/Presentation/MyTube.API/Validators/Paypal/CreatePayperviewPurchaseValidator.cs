using FluentValidation;
using Microsoft.AspNetCore.Http;
using System;
using MyTube.API.Models.Paypal;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Url;
using MyTube.Services.Purchase;
using MyTube.Services.Video;

namespace MyTube.API.Validators.Paypal
{
    public class CreatePayperviewPurchaseValidator : AbstractValidator<CreatePayperviewPurchaseModel>
    {

        private readonly IVideoService _videoService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IPurchaseService _purchaseService;

        public CreatePayperviewPurchaseValidator(IVideoService videoService, IHttpContextAccessor contextAccessor,
                                                    IPurchaseService purchaseService)
        {

            _videoService = videoService;
            _contextAccessor = contextAccessor;
            _purchaseService = purchaseService;

            RuleFor(p => p.PaidContentHash)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(ValidPaidContentHash)
                    .WithMessage(MessageHelper.Invalid)
                .Must(LoggedUserNotTheVideoOwner)
                    .WithMessage(MessageHelper.NotAllowedToPurchaseOwnContent)
                .Must(NoActiveCouponCode)
                    .WithMessage(MessageHelper.ExistingValidCouponCodeFound);

            RuleFor(p => p.ReturnUrl)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(UrlMustValid)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.CancelUrl)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(UrlMustValid)
                    .WithMessage(MessageHelper.Invalid);

        }

        private bool NoActiveCouponCode(string paidContentHash)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                var video = _videoService.GetVideo(paidContentHash);
                if(video != null)
                {
                    return _purchaseService.GetPurchaseCount(PurchaseType.PayPerView, user.Id, video.Id) == 0;
                }    
            }

            return false;
        }

        private bool UrlMustValid(string url)
        {
            return UrlHelper.IsUrlValid(url);
        }

        private bool LoggedUserNotTheVideoOwner(string paidContentHash)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                return _videoService.GetVideoCount(user.Id, paidContentHash) == 0;
            }

            return false;
        }

        private bool ValidPaidContentHash(string paidContentHash)
        {
            return _videoService.GetVideoCount(paidContentHash, true) == 1;
        }
    }
}
