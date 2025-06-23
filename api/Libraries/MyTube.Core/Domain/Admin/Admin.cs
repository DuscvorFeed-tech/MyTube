using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.Admin
{

    [Table("admin")]
    public class Admin : BaseDomain
    {

        [Required]
        [MaxLength(LengthHelper.User_Email_MaxLength)]
        public string Email { get; set; }

        [Required]
        public byte[] PasswordHash { get; set; }

        [Required]
        public byte[] PasswordSalt { get; set; }

    }
}
