using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Payout
{

    [Table("payout_header")]
    public class PayoutHeader : BaseDomain
    {

        public string SenderBatchId { get; set; }

        public string PayoutBatchId { get; set; }

        public bool SentToPaypal { get; set; }

        public DateTime? DateSent { get; set; }

        /// <summary>
        /// PAYPAL.time_completed
        /// </summary>
        public DateTime? Ref_TimeCompleted { get; set; }

        public virtual ICollection<PayoutArtist> Artists { get; set; }
        
    }
}
