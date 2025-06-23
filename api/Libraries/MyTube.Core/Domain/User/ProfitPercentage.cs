using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.User
{

    [Table("profit_percentage")]
    public class ProfitPercentage : BaseDomain
    {

        [Required]
        public long UserId { get; set; }

        public int? PayPerView { get; set; }

        public int? LiveTicket { get; set; }

        public int? Subscription { get; set; }

    }
}
