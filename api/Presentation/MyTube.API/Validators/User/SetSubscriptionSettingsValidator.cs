using FluentValidation;
using Microsoft.AspNetCore.Http;
using System;
using MyTube.API.Models.User;
using MyTube.Core.Domain.SubscriptionSettings.Enums;
using MyTube.Core.Domain.User.Enums;
using MyTube.Services.Helpers.Message;
using MyTube.Services.SubscriptionSettings;

namespace MyTube.API.Validators.User
{
    public class SetSubscriptionSettingsValidator : AbstractValidator<SetSubscriptionSettingsModel>
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ISubscriptionSettingsService _subscriptionSettingsService;

        public SetSubscriptionSettingsValidator(IHttpContextAccessor contextAccessor, ISubscriptionSettingsService subscriptionSettingsService )
        {

            _contextAccessor = contextAccessor;
            _subscriptionSettingsService = subscriptionSettingsService;

            RuleFor(p => p)
                .Must(UserTypeMustBeCreator)
                    .WithName("User")
                    .WithMessage(MessageHelper.SubscriptionSettingsIsAllowedForCreatorUserOnly);

            RuleFor(p => p.Subscription)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(SubscriptionSettingsExist)
                    .WithMessage(MessageHelper.NoRecordFound);

                    

            RuleFor(p => p.Amount)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .When(p => p.Subscription == true)
                    .WithMessage(MessageHelper.Required)
                .GreaterThan(0)
                    .When(p => p.Subscription == true)
                    .WithMessage(MessageHelper.MustBeGreaterThan);

        }

        private bool SubscriptionSettingsExist(bool? subscription)
        {
            if (subscription == false)
            {
                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user != null)
                {

                    return _subscriptionSettingsService.GetSubscriptionSettingsCount(user.Id, new SubscriptionSettingsType[] { SubscriptionSettingsType.Active, SubscriptionSettingsType.Created }) == 1;

                }

                return false;
            }

            return true;
        }

        private bool UserTypeMustBeCreator(SetSubscriptionSettingsModel model)
        {
            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {

                return user.UserType == UserType.Creator;

            }

            return false;
        }
    }
}
