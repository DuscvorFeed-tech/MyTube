using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.Payout;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Payout
{
    public interface IPayoutHeaderService
    {
        
        Task<BaseResponse> InsertPayoutHeaderAsync(PayoutHeader header);
        
        Task<List<PayoutHeader>> GetPayoutHeaderListAsync(bool sentToPaypal, bool asNoTracking = true);
        
        Task<BaseResponse> UpdatePayoutHeaderAsync(long id, bool sentToPaypal, string payoutBatchId);
        
        Task<BaseResponse> UpdatePayoutHeaderAsync(PayoutHeader header);

        Task<List<PayoutArtist>> GetPayoutArtistListAsync(List<long> payoutArtistIds);
        
        Task<List<PayoutItem>> GetPayoutItemListAsync(List<long> payoutItemIds, Core.Domain.Purchase.Enums.PurchaseType purchaseType, bool asNoTracking = true);
        
        Task<BaseResponse> UpdatePayoutItemAsync(List<PayoutItem> payoutItemList);

    }
}
