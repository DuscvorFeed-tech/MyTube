using FluentValidation;
using MyTube.API.Models.User;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Message;
using MyTube.Services.RegistrationCode;

namespace MyTube.API.Validators.User
{
    public class SignUpConfirmationValidator : AbstractValidator<SignUpConfirmationModel>
    {

        private readonly IRegistrationCodeService _registrationCodeService;

        public SignUpConfirmationValidator(IRegistrationCodeService registrationCodeService)
        {

            _registrationCodeService = registrationCodeService;

            RuleFor(p => p)
                .Must(KeyAndConfirmationCodeValid)
                    .WithName("Key|ConfirmationCode")
                        .WithMessage(MessageHelper.Invalid);


        }

        private bool KeyAndConfirmationCodeValid(SignUpConfirmationModel model)
        {
            if (model.Key.HasValue() == true && model.ConfirmationCode.HasValue() == true)
            {

                return _registrationCodeService.GetRegistrationCodeCount(model.Key, model.ConfirmationCode, true) == 1;

            }

            return false;
        }

    }

}
