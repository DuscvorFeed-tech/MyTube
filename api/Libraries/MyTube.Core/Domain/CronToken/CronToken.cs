using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.CronToken
{

    [Table("cron_token")]
    public class CronToken : BaseDomain
    {

        [Required]
        public string Cron { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public bool Active { get; set; }

    }

}
