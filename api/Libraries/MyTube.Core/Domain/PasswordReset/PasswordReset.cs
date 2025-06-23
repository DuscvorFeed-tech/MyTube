using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.PasswordReset
{

    [Table("password_reset")]
    public class PasswordReset : BaseDomain
    {

        public long UserId { get; set; }

        [MaxLength(LengthHelper.PasswordReset_Key_MaxLength)]
        public string Key { get; set; }

        [MaxLength(LengthHelper.PasswordReset_ConfirmationCode_MaxLength)]
        public string ConfirmationCode { get; set; }

        public DateTime? DateConfirmed { get; set; }

        [MaxLength(LengthHelper.PasswordReset_ResetCode_MaxLength)]
        public string ResetCode { get; set; }

        public DateTime? DateReset { get; set; }

        public bool Active { get; set; }

        public virtual Core.Domain.User.User User { get; set; }

    }
}
