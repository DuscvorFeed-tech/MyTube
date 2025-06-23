using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Purchase
{

    [Table("purchase_coupon")]
    public class PurchaseCoupon : BaseDomain
    {

        [Required]
        public long PurchaseId { get; set; }

        [Required]
        public string CouponCode { get; set; }

        public bool Active { get; set; }

        public DateTime? DateActivated { get; set; }

        public bool Expired { get; set; }

        public virtual Purchase Purchase { get; set; }

    }

}
