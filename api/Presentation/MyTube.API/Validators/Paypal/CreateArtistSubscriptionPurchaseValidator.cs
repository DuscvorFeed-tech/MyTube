using FluentValidation;
using Microsoft.AspNetCore.Http;
using MyTube.API.Models.Paypal;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Url;
using MyTube.Services.Purchase;
using MyTube.Services.SubscriptionSettings;
using MyTube.Services.Video;

namespace MyTube.API.Validators.Paypal
{
    public class CreateArtistSubscriptionPurchaseValidator : AbstractValidator<CreateArtistSubscriptionPurchaseModel>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISubscriptionSettingsService _subscriptionSettingsService;
        private readonly IPurchaseService _purhcaseService;
        private readonly IVideoService _videoService;

        public CreateArtistSubscriptionPurchaseValidator(IHttpContextAccessor contextAccessor, ISubscriptionSettingsService subscriptionSettingsService,
                                                            IPurchaseService purhcaseService, IVideoService videoService)
        {

            _contextAccessor = contextAccessor;
            _subscriptionSettingsService = subscriptionSettingsService;
            _purhcaseService = purhcaseService;
            _videoService = videoService;

            RuleFor(p => p.Artist)
                    .Cascade(CascadeMode.Stop)
                    .NotEmpty()
                        .WithMessage(MessageHelper.Required)
                    .Must(ValidArtist)
                        .WithMessage(MessageHelper.Invalid)
                    .Must(LoggedUserNotTheArtist)
                        .WithMessage(MessageHelper.CannotSubscribeToOwnAccount)
                    .Must(NotYetSubsribed)
                        .WithMessage(MessageHelper.AlreadySubscribedToArtist);

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

        private bool NotYetSubsribed(string artist)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                var subscriptionSettings = _subscriptionSettingsService.GetSubscriptionSettings(artist, true, Core.Domain.User.Enums.UserType.Creator, Core.Domain.User.Enums.UserStatusType.Active, Core.Domain.SubscriptionSettings.Enums.SubscriptionSettingsType.Active);
                if(subscriptionSettings != null)
                {
                    return _purhcaseService.GetPurchaseCount(Core.Domain.Purchase.Enums.PurchaseType.Subscription, user.Id, subscriptionSettings.Id) == 0;
                }
            }

            return false;
        }

        private bool UrlMustValid(string url)
        {
            return UrlHelper.IsUrlValid(url);
        }


        private bool ValidArtist(string artist)
        {
            return _subscriptionSettingsService.GetSubscriptionSettingsCount(artist, true, Core.Domain.User.Enums.UserType.Creator, Core.Domain.User.Enums.UserStatusType.Active, Core.Domain.SubscriptionSettings.Enums.SubscriptionSettingsType.Active) == 1;
        }

        private bool LoggedUserNotTheArtist(string artist)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {
                return user.Username.ToLower() != artist.ToLower();
            }

            return false;
        }
    }
}
