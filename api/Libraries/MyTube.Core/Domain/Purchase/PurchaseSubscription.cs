using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.Purchase.Enums;

namespace MyTube.Core.Domain.Purchase
{

    [Table("purchase_subscription")]
    public class PurchaseSubscription : BaseDomain
    {

        [Required]
        public long PurchaseId { get; set; }

        [Required]
        public string Ref_SubscriptionId { get; set; }

        public string Ref_SubscriptionUrl { get; set; }

        public string Ref_PayerId { get; set; }

        public string Ref_FirstName { get; set; }

        public string Ref_LastName { get; set; }

        public string Ref_TransactionId { get; set; }

        /// <summary>
        /// PAYPAL.gross_amount
        /// </summary>
        public double? Ref_GrossAmount { get; set; }

        /// <summary>
        /// PAYPAL.paypal_fee
        /// </summary>
        public double? Ref_Fee { get; set; }

        /// <summary>
        /// PAYPAL.net_amount
        /// </summary>
        public double? Ref_NetAmount { get; set; }

        public double? NetAmount { get; set; }

        public DateTime? Ref_DatePaid { get; set; }

        public PaymentStatusType? PaymentStatusType { get; set; }

        public DateTime? Ref_NextBillingDate { get; set; }

        public bool Billed { get; set; }

        public virtual Purchase Purchase { get; set; }

    }

}
