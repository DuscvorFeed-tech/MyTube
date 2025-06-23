using FluentValidation;
using Microsoft.AspNetCore.Http;
using MyTube.API.Models.FileCoin;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Purchase;
using MyTube.Services.Webinar;

namespace MyTube.API.Validators.FileCoin
{
    public class CreateLiveTicketPurchaseValidator : AbstractValidator<CreateLiveTicketPurchaseModel>
    {

        private readonly IWebinarService _webinarService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IPurchaseService _purchaseService;
        private Core.Domain.Webinar.Webinar _webinar;

        public CreateLiveTicketPurchaseValidator(IWebinarService webinarService, IHttpContextAccessor contextAccessor,
                                                    IPurchaseService purchaseService)
        {

            _webinarService = webinarService;
            _contextAccessor = contextAccessor;
            _purchaseService = purchaseService;

            RuleFor(p => p.LiveTicketHash)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(ValidLiveContentHash)
                    .WithMessage(MessageHelper.Invalid)
                .Must(LoggedUserNotTheWebinarOwner)
                    .WithMessage(MessageHelper.NotAllowedToPurchaseOwnContent)
                .Must(LiveTicketNotPurchasedYet)
                    .WithMessage(MessageHelper.AlreadyPurchasedLiveTicket)
                .Must(LiveTicketsNotYetSold)
                    .WithMessage(MessageHelper.LiveTicketsSold)
                .Must(NoWaitingForPaymentPurchase)
                    .WithMessage(MessageHelper.WaitingForPaymentConfirmation)
                .Must(LiveTicketFilPriceMustValid)
                    .WithName("LiveTicketFilPrice")
                    .WithMessage(MessageHelper.Invalid);
        }

        private bool LiveTicketFilPriceMustValid(string liveContentHash)
        {
            if(this._webinar != null)
            {
                return this._webinar.LiveTicketFilPrice > 0;
            }

            return false;
        }

        private bool ValidLiveContentHash(string liveContentHash)
        {
            _webinar = _webinarService.GetWebinar(liveContentHash);
            if (_webinar != null)
            {
                return _webinar.WebinarStatusType == Core.Domain.Webinar.Enums.WebinarStatusType.ScheduleLive;
            }

            return false;
        }

        private bool LoggedUserNotTheWebinarOwner(string liveTicketHash)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                return _webinarService.GetWebinarCount(user.Id, liveTicketHash) == 0;
            } 

            return false;
        }

        private bool LiveTicketsNotYetSold(string liveTicketHash)
        {
            if (liveTicketHash.HasValue())
            {
                return _webinarService.GetWebinarCount(liveTicketHash, true) == 1;
            }

            return true;
        }

        private bool LiveTicketNotPurchasedYet(string liveTicketHash)
        {
            if (liveTicketHash.HasValue())
            {
                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user != null)
                {
                    if (_webinar != null)
                    {
                        return _purchaseService.GetPurchaseCount(PurchaseType.LiveTicket, user.Id, _webinar.Id) == 0;
                    }
                }

                return false;

            }

            return true;

        }

        private bool NoWaitingForPaymentPurchase(string liveContentHash)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                if (_webinar != null)
                {
                    return _purchaseService.GetPurchaseCount(PurchaseType.LiveTicket, PaymentType.Fil, PurchaseStatusType.WaitingForPayment, user.Id, _webinar.Id) == 0;
                }
            }

            return false;

        }

    }
}
