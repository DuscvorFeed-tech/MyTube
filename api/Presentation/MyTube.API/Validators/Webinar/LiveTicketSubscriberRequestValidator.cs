using FluentValidation;
using Microsoft.AspNetCore.Http;
using MyTube.API.Models.Webinar;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Purchase;
using MyTube.Services.Webinar;

namespace MyTube.API.Validators.Webinar
{
    public class LiveTicketSubscriberRequestValidator : AbstractValidator<LiveTicketSubscriberRequestModel>
    {

        private readonly IWebinarService _webinarService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IPurchaseService _purchaseService;

        public LiveTicketSubscriberRequestValidator(IWebinarService webinarService, IHttpContextAccessor contextAccessor,
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
                .Must(UserMustBeSubscriberOfLiveTicketOwner)
                    .WithMessage(MessageHelper.ArtistSubscriptionIsRequiredForLiveTicketSlot);

        }

        private bool UserMustBeSubscriberOfLiveTicketOwner(string liveTicketHash)
        {
            if (liveTicketHash.HasValue())
            {

                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user != null)
                {
                    var webinar = _webinarService.GetWebinar(liveTicketHash);
                    if (webinar == null || webinar.CreatedByUser == null || webinar.CreatedByUser.SubscriptionSettings == null)
                    {
                        return false;
                    }

                    return _purchaseService.GetPurchaseCount(PurchaseType.Subscription, user.Id, webinar.CreatedByUser.SubscriptionSettings.Id) >= 1;

                }

            }

            return true;

        }

        private bool ValidLiveContentHash(string liveTicketHash)
        {
            return _webinarService.GetWebinarCount(liveTicketHash, Core.Domain.Webinar.Enums.WebinarStatusType.ScheduleLive) == 1;
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

        private bool LiveTicketNotPurchasedYet(string liveTicketHash)
        {
            if (liveTicketHash.HasValue())
            {
                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user != null)
                {
                    var webinar = _webinarService.GetWebinar(liveTicketHash);
                    if (webinar != null)
                    {
                        return _purchaseService.GetPurchaseCount(PurchaseType.LiveTicket, user.Id, webinar.Id) == 0;
                    }
                }

                return false;

            }

            return true;
        }

        private bool LiveTicketsNotYetSold(string liveTicketHash)
        {
            if (liveTicketHash.HasValue())
            {
                return _webinarService.GetWebinarCount(liveTicketHash, true) == 1;
            }

            return true;
        }
    }
}
