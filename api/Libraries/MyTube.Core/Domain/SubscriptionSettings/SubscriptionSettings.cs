using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.SubscriptionSettings.Enums;

namespace MyTube.Core.Domain.SubscriptionSettings
{

    [Table("subscription_settings")]
    public class SubscriptionSettings : BaseDomain
    {

        public long UserId { get; set; }

        public double Amount { get; set; }

        public string Ref_PlanId { get; set; }

        public SubscriptionSettingsType SubscriptionSettingsType { get; set; }

        public virtual User.User User { get; set; }

    }
}
