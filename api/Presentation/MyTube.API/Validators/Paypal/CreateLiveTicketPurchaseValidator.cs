using FluentValidation;
using Microsoft.AspNetCore.Http;
using MyTube.API.Models.Paypal;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Url;
using MyTube.Services.Purchase;
using MyTube.Services.Webinar;

namespace MyTube.API.Validators.Paypal
{
    public class CreateLiveTicketPurchaseValidator : AbstractValidator<CreateLiveTicketPurchaseModel>
    {

        private readonly IWebinarService _webinarService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IPurchaseService _purchaseService;

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
                    .WithMessage(MessageHelper.LiveTicketsSold);

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
            if(liveTicketHash.HasValue())
            {
                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user != null)
                {
                    var webinar = _webinarService.GetWebinar(liveTicketHash);
                    if(webinar != null)
                    {
                        return _purchaseService.GetPurchaseCount(PurchaseType.LiveTicket, user.Id, webinar.Id) == 0;
                    }
                }

                return false;

            }

            return true;

        }

        private bool UrlMustValid(string url)
        {
            return UrlHelper.IsUrlValid(url);
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

        private bool ValidLiveContentHash(string liveContentHash)
        {
            return _webinarService.GetWebinarCount(liveContentHash, Core.Domain.Webinar.Enums.WebinarStatusType.ScheduleLive) == 1;
        }
    }
}
