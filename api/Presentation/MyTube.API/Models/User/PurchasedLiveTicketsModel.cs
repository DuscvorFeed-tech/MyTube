using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Services.Helpers.Filter.Purchase;

namespace MyTube.API.Models.User
{
    public class PurchasedLiveTicketsModel : PurchaseFilter
    {

        public override PurchaseType FilterType => PurchaseType.LiveTicket;

    }
}
