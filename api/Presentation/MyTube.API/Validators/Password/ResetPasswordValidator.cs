using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.API.Models.Password;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Core.Helpers.Lengths;
using MyTube.Services.Helpers.Message;
using MyTube.Services.PasswordReset;

namespace MyTube.API.Validators.Password
{
    public class ResetPasswordValidator : AbstractValidator<ResetPasswordModel>
    {

        private readonly IPasswordResetService _passwordResetService;

        public ResetPasswordValidator(IPasswordResetService passwordResetService)
        {
            _passwordResetService = passwordResetService;

            RuleFor(p => p)
                .Must(KeyAndResetCodeValid)
                    .WithName("Key|ResetCode")
                        .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MinimumLength(LengthHelper.User_Password_MinLength)
                    .WithMessage(MessageHelper.LessThanRequiredMinLength)
                .MaximumLength(LengthHelper.User_Password_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.ConfirmPassword)
                .Equal(p => p.Password)
                    .WithMessage(MessageHelper.NotMatch);

        }

        private bool KeyAndResetCodeValid(ResetPasswordModel model)
        {

            if (model.Key.HasValue() == true && model.ResetCode.HasValue() == true)
            {

                return _passwordResetService.GetPasswordResetCount(model.Key, model.ResetCode, UserStatusType.ForgotPasswordConfirmed) == 1;

            }

            return false;

        }

    }
}
