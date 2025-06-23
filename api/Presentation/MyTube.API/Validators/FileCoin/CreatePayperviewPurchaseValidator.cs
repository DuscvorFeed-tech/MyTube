using FluentValidation;
using Microsoft.AspNetCore.Http;
using MyTube.API.Models.FileCoin;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Purchase;
using MyTube.Services.Video;

namespace MyTube.API.Validators.FileCoin
{
    public class CreatePayperviewPurchaseValidator : AbstractValidator<CreatePayperviewPurchaseModel>
    {

        private readonly IVideoService _videoService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IPurchaseService _purchaseService;
        private Core.Domain.Video.Video _video;

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
                    .WithMessage(MessageHelper.ExistingValidCouponCodeFound)
                .Must(NoWaitingForPaymentPurchase)
                    .WithMessage(MessageHelper.WaitingForPaymentConfirmation)
                .Must(PaidContentFilPriceMustValid)
                    .WithName("PaidContentFilPrice")
                    .WithMessage(MessageHelper.Invalid);

        }

        private bool PaidContentFilPriceMustValid(string paidContentHash)
        {
            if (this._video != null)
            {
                return this._video.PaidContentFilPrice > 0;
            }

            return false;

        }

        private bool NoWaitingForPaymentPurchase(string paidContentHash)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                if (_video != null)
                {
                    return _purchaseService.GetPurchaseCount(PurchaseType.PayPerView, PaymentType.Fil, PurchaseStatusType.WaitingForPayment, user.Id, _video.Id) == 0;
                }
            }

            return false;
        }

        private bool NoActiveCouponCode(string paidContentHash)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                if (_video != null)
                {
                    return _purchaseService.GetPurchaseCount(PurchaseType.PayPerView, user.Id, _video.Id) == 0;
                }
            }

            return false;
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
            _video = _videoService.GetVideo(paidContentHash);

            return _video != null;
        }

    }
}
