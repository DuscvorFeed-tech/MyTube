using FluentValidation;
using MyTube.API.Models.Password;
using MyTube.Core.Domain.User.Enums;
using MyTube.Services.Helpers.Message;
using MyTube.Services.User;

namespace MyTube.API.Validators.Password
{
    public class ForgotPasswordValidator : AbstractValidator<ForgotPasswordModel>
    {

        private readonly IUserService _userService;

        public ForgotPasswordValidator(IUserService userService)
        {

            _userService = userService;

            RuleFor(p => p.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .EmailAddress()
                    .WithMessage(MessageHelper.Invalid)
                .Must(RegisteredAndActive)
                    .WithMessage(p => (MessageHelper.NoRecordFound));

        }

        private bool RegisteredAndActive(string email)
        {
            return _userService.GetUserCount(email, UserStatusType.Active, true) == 1;
        }

    }
}
