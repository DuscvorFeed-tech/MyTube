using FluentValidation;
using MyTube.API.Models.Paypal;
using MyTube.Services.Helpers.Message;

namespace MyTube.API.Validators.Paypal
{
    public class UpdateLiveTicketPurchaseValidator : AbstractValidator<UpdateLiveTicketPurchaseModel>
    {

        public UpdateLiveTicketPurchaseValidator()
        {

            RuleFor(p => p.Token)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required);

        }

    }
}
