using FluentValidation;
using MyTube.API.Models.Password;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Message;
using MyTube.Services.PasswordReset;

namespace MyTube.API.Validators.Password
{
    public class ForgotPasswordConfirmationValidator : AbstractValidator<ForgotPasswordConfirmationModel>
    {

        private readonly IPasswordResetService _passwordResetService;

        public ForgotPasswordConfirmationValidator(IPasswordResetService passwordResetService)
        {
            _passwordResetService = passwordResetService;

            RuleFor(p => p)
                .Must(KeyAndConfirmationCodeValid)
                    .WithName("Key|ConfirmationCode")
                        .WithMessage(MessageHelper.Invalid);
        }

        private bool KeyAndConfirmationCodeValid(ForgotPasswordConfirmationModel model)
        {

            if (model.Key.HasValue() == true && model.ConfirmationCode.HasValue() == true)
            {

                return _passwordResetService.GetPasswordResetCount(model.Key, model.ConfirmationCode, UserStatusType.ForgotPasswordEmailSent) == 1;

            }

            return false;

        }

    }
}
