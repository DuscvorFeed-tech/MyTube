using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.SnsAccount
{

    [Table("sns_account")]
    public class SnsAccount : BaseDomain
    {

        [Required]
        public long UserId { get; set; }

        [MaxLength(LengthHelper.SnsAccount_Instagram_MaxLength)]
        public string Instagram { get; set; }

        [MaxLength(LengthHelper.SnsAccount_Facebook_MaxLength)]
        public string Facebook { get; set; }

        [MaxLength(LengthHelper.SnsAccount_Twitter_MaxLength)]
        public string Twitter { get; set; }

        [MaxLength(LengthHelper.SnsAccount_Youtube_MaxLength)]
        public string Youtube { get; set; }

    }

}
