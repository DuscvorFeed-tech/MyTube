using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Purchase
{

    [Table("purchase_detail")]
    public class PurchaseDetail : BaseDomain
    {

        [Required]
        public long PurchaseId { get; set; }

        [Required]
        public string Ref_OrderId { get; set; }

        public string Ref_OrderUrl { get; set; }
        
        public string Ref_AuthorizationId { get; set; }
        
        public string Ref_PayerId { get; set; }
        
        public string Ref_FirstName { get; set; }

        public string Ref_LastName { get; set; }
        
        public string Ref_CaptureId { get; set; }

        public string WalletAddress { get; set; }

        public string PrivateKey { get; set; }

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
        
    }
}
