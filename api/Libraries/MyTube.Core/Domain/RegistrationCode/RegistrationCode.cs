using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.RegistrationCode
{

    [Table("registration_code")]
    public class RegistrationCode : BaseDomain
    {

        [Required]
        public long UserId { get; set; }

        [Required]
        [MaxLength(LengthHelper.RegistrationCode_Key_MaxLength)]
        public string Key { get; set; }

        [Required]
        [MaxLength(LengthHelper.RegistrationCode_ConfirmationCode_MaxLength)]
        public string ConfirmationCode { get; set; }

        public bool Active { get; set; }

    }
}
