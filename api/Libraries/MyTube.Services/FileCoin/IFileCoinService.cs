using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.FileCoin
{
    public interface IFileCoinService
    {
        
        Task<BaseResponse> InsertPurchaseAsync(PurchaseType purchaseType, string paidContentHash);

    }
}
