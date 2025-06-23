using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Sales
{


    [Table("sales")]
    public class Sales : BaseDomain
    {

        [Required]
        public long UserId { get; set; }

        [Required]
        public long PurchaseId { get; set; }

        public long PurchaseSubscriptionId { get; set; }

        public virtual User.User Artist { get; set; }

    }

}
