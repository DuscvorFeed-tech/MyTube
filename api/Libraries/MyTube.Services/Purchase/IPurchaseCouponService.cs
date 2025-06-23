using System;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Purchase
{
    public interface IPurchaseCouponService
    {

        Task<BaseResponse> InsertPurchaseCouponAsync(PurchaseCoupon entity);

        long? GetPurchaseCouponCount(long purchaseId, string coupon);

        int GetPurchaseCouponCount(long userId, string couponCode, bool active, DateTime? dateActivated, bool expired);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="active"></param>
        /// <param name="whereCondition">
        /// 0 - UserId
        /// 1 - CouponCode
        /// 2 - Active
        /// 3 - DateActivated
        /// </param>
        /// <returns></returns>
        Task<BaseResponse> UpdatePurchaseCouponAsync(bool active, params object[] whereCondition);

        Task<BaseResponse> UpdatePurchaseCouponAsync(int payPerViewCouponCodeValidity);

    }
}
