using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace MyTube.Core.Domain.Payout
{

    [Table("payout_artist")]
    public class PayoutArtist : BaseDomain
    {

        /// <summary>
        /// payout_header.Id
        /// </summary>
        public long PayoutHeaderId { get; set; }

        public long UserId { get; set; }

        public Purchase.Enums.PaymentStatusType? PaymentStatusType { get; set; }

        public string Ref_ActivityId { get; set; }

        public string Ref_PayoutItemId { get; set; }

        public string Ref_TransactionId { get; set; }

        public double? Ref_Fee { get; set; }

        public string Ref_ErrorName { get; set; }

        public string Ref_ErrorMessage { get; set; }

        public double TotalAmount
        {
            get
            {
                if(this.Items != null)
                {

                    return Math.Round((Double)Items.Sum(p => p.Amount), 2);

                }

                return 0;

            }
        }

        public virtual User.User User { get; set; }

        public virtual PayoutHeader PayoutHeader { get; set; }

        public virtual ICollection<PayoutItem> Items { get; set; }
        
    }
}
