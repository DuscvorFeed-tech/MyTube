using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Statistics
{

    [Table("statistics")]
    public class Statistics : BaseDomain
    {

        /// <summary>
        /// user.Id WHERE user.UserType = Creator
        /// </summary>
        public long ArtistId { get; set; }

        public int ArtistCounter { get; set; }

        /// <summary>
        /// video.Id  WHERE PaidContent = true
        /// </summary>
        public long PayPerViewId { get; set; }

        public int PayPerViewCounter { get; set; }

        /// <summary>
        /// webinar.Id WHERE LiveTicket = true
        /// </summary>
        public long LiveTicketId { get; set; }

        public int LiveTicketCounter { get; set; }

        /// <summary>
        /// subscription_settings.Id
        /// </summary>
        public long SubscriptionId { get; set; }

        public int SubscriptionCounter { get; set; }

        /// <summary>
        /// user.Id WHERE user.UserType = Basic
        /// </summary>
        public long UserId { get; set; }

        public int UserCounter { get; set; }

        /// <summary>
        /// purchase.Id WHERE PurchaseType = PayPerView
        /// </summary>
        public long PayPerViewSalesId { get; set; }

        public double PayPerViewSalesAmount { get; set; }

        /// <summary>
        /// purchase.Id WHERE PurchaseType = LiveTicket
        /// </summary>
        public long LiveTicketSalesId { get; set; }

        public double LiveTicketSalesAmount { get; set; }

        /// <summary>
        /// purchase_subscription.Id
        /// </summary>
        public long SubscriptionSalesId { get; set; }

        public double SubscriptionSalesAmount { get; set; }

        public DateTime? DateCounted { get; set; }

    }
}
