using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Paypal
{
    public interface IPaypalService
    {

        void SetSysSettings();

        /// <summary>
        /// 
        /// </summary>
        /// <param name="purchaseType"></param>
        /// <param name="paymentType"></param>
        /// <param name="hash">video.PaidContentHash or webinar.LiveTicketHash</param>
        /// <param name="returnUrl"></param>
        /// <param name="cancelUrl"></param>
        /// <returns></returns>
        Task<BaseResponse> InsertPurchaseAsync(PurchaseType purchaseType, PaymentType paymentType, string hash, string returnUrl, string cancelUrl);

        Task<BaseResponse> UpdatePurchaseAsync(PurchaseType purchaseType, string ref_OrderIdSubscriptionId);

    }
}
