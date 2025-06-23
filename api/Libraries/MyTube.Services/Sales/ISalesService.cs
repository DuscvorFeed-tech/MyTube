using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;

namespace MyTube.Services.Sales
{
    public interface ISalesService
    {
        
        Task<List<long>> GetUserIdListWithSalesAsync();

        Task<List<Core.Domain.Payout.PayoutItem>> GetSalesPurchaseListAsync(long userId, DateTime? dateFrom, DateTime? dateTo, PaymentStatusType pending, PurchaseType payPerView);

    }

}
