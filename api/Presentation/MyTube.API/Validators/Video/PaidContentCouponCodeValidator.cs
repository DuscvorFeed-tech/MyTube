using FluentValidation;
using Microsoft.AspNetCore.Http;
using MyTube.API.Models.Video;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Purchase;

namespace MyTube.API.Validators.Video
{
    public class PaidContentCouponCodeValidator : AbstractValidator<PaidContentCouponCodeModel>
    {

        private readonly IHttpContextAccessor _contextAccessor;
        private readonly IPurchaseCouponService _couponService;

        public PaidContentCouponCodeValidator(IHttpContextAccessor contextAccessor, IPurchaseCouponService paypalPayperviewOrderCouponService)
        {

            _contextAccessor = contextAccessor;
            _couponService = paypalPayperviewOrderCouponService;

            RuleFor(p => p.CouponCode)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(CouponCodeValid)
                    .WithMessage(MessageHelper.Invalid);

        }

        private bool CouponCodeValid(string couponCode)
        {

            if (couponCode.HasValue() == true)
            {
                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user != null)
                {
                    return _couponService.GetPurchaseCouponCount(user.Id, couponCode, false, null, false) == 1;
                }

                return false;
            }

            return true;

        }

    }
}
