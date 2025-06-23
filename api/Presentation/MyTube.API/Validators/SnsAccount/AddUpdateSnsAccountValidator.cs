using FluentValidation;
using MyTube.API.Models.SnsAccount;
using MyTube.Core.Helpers.Lengths;
using MyTube.Services.Helpers.Message;

namespace MyTube.API.Validators.SnsAccount
{
    public class AddUpdateSnsAccountValidator : AbstractValidator<AddUpdateSnsAccountModel>
    {

        public AddUpdateSnsAccountValidator()
        {

            RuleFor(p => p.Instagram)
                .MaximumLength(LengthHelper.SnsAccount_Instagram_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.Facebook)
                .MaximumLength(LengthHelper.SnsAccount_Instagram_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.Twitter)
                .MaximumLength(LengthHelper.SnsAccount_Instagram_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.Youtube)
                .MaximumLength(LengthHelper.SnsAccount_Instagram_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

        }

    }

}
