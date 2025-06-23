using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Payout
{

    [Table("payout_item")]
    public class PayoutItem : BaseDomain
    {

        /// <summary>
        /// payout_artist.Id
        /// </summary>
        public long PayoutArtistId { get; set; }

        /// <summary>
        /// purchase.Id (For: PayPerView & LiveTicket)
        /// </summary>
        public long PurchaseId { get; set; }

        /// <summary>
        /// purchase_subscription.Id
        /// </summary>
        public long PurchaseSubscriptionId { get; set; }

        public double Amount { get; set; }

        public virtual PayoutArtist PayoutArtist { get; set; }

        public virtual Purchase.Purchase Purchase { get; set; }

        public virtual Purchase.PurchaseSubscription Subscription { get; set; }

    }
}
