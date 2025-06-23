using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Domain.Zoom;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.User
{

    [Table("user")]
    public class User : BaseDomain
    {

        [Required]
        [MaxLength(LengthHelper.User_Username_MaxLength)]
        public string Username { get; set; }

        [Required]
        [MaxLength(LengthHelper.User_Email_MaxLength)]
        public string Email { get; set; }

        [Required]
        [JsonIgnore]
        public byte[] PasswordHash { get; set; }

        [Required]
        [JsonIgnore]
        public byte[] PasswordSalt { get; set; }

        [Required]
        public int LocaleType { get; set; }

        [Required]
        public UserType? UserType { get; set; }

        [MaxLength(LengthHelper.User_PublicKey_MaxLength)]
        public string PublicKey { get; set; }

        public bool Subscription { get; set; }

        [Required]
        public UserStatusType? UserStatusType { get; set; }

        public string ProfilePictureHash { get; set; }

        public virtual ZoomApp ZoomApp { get; set; }

        public virtual ProfitPercentage ProfitPercentage { get; set; }

        public virtual SubscriptionSettings.SubscriptionSettings SubscriptionSettings { get; set; }

        public virtual ICollection<Core.Domain.Webinar.Webinar> Webinars { get; set; }

        public virtual ICollection<Core.Domain.Video.Video> Videos { get; set; }

        public virtual ICollection<Core.Domain.Sales.Sales> Sales { get; set; }

    }

}
