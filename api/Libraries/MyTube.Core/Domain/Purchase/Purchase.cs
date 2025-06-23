using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.Purchase.Enums;

namespace MyTube.Core.Domain.Purchase
{

    [Table("purchase")]
    public class Purchase : BaseDomain
    {

        [Required]
        public long UserId { get; set; }

        [Required]
        public PurchaseType PurchaseType { get; set; }

        [Required]
        public PaymentType PaymentType { get; set; }

        public long VideoId { get; set; }

        public long WebinarId { get; set; }

        public long SubscriptionSettingsId { get; set; }

        public string Ref_SubscriptionStart { get; set; }

        [Required]
        public PurchaseStatusType? PurchaseStatusType { get; set; }

        [Required]
        public bool Active { get; set; }

        public SubscriptionEmailStatusType? SubscriptionEmailStatusType { get; set; }

        public PaymentStatusType? PaymentStatusType { get; set; }

        public virtual PurchaseDetail Detail { get; set; }

        public virtual ICollection<PurchaseSubscription> Subscriptions { get; set; }

        public virtual User.User User { get; set; }

        public virtual Video.Video Video { get; set; }

        public virtual Webinar.Webinar Webinar { get; set; }

        public virtual SubscriptionSettings.SubscriptionSettings SubscriptionSettings { get; set; }

        public virtual PurchaseCoupon Coupon { get; set; }

        public virtual Sales.Sales Sales { get; set; }

    }
}
