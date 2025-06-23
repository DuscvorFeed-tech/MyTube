using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Services.Helpers.Filter.Purchase;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Purchase
{
    public interface IPurchaseService
    {
        
        Task<BaseResponse> InsertPurchaseAsync(Core.Domain.Purchase.Purchase entity);

        Task<List<Core.Domain.Purchase.Purchase>> GetPurchaseListAsync(PurchaseType purchaseType, PurchaseStatusType purchaseStatusType, SubscriptionEmailStatusType? emailStatusType = null);

        Task<BaseResponse> UpdatePurchaseAsync(long id, PurchaseStatusType orderStatusType);

        Task<object> GetPurchaseListAsync(PurchaseFilter filter);
        
        long? GetPurchaseCount(PurchaseType purchaseType, long userId, long videoIdWebinarIdSubscriptionSettingsId);

        long? GetPurchaseCount(PurchaseType purchaseType, PaymentType paymentType, PurchaseStatusType purchaseStatusType, long userId, long videoIdWebinarIdSubscriptionSettingsId);

        Task<BaseResponse> UpdatePurchaseAsync(long id, SubscriptionEmailStatusType emailStatusType);

        Task<BaseResponse> UpdatePurchaseAsync(long id, long subscriptionId, string ref_FirstName, string ref_LastName, string ref_PayerId, DateTime? ref_DatePaid, DateTime? ref_NextBillingDate, string ref_TransactionId, double? ref_GrossAmount, double? ref_Fee, double? ref_NetAmount, PurchaseStatusType purchaseStatus, SubscriptionEmailStatusType emailStatusType);
        
        Task<BaseResponse> CancelSubscription(long? subscriptionId);
        
        Task<BaseResponse> LiveTicketSubscriberPurchaseAsync(string liveTicketHash);

    }
}
