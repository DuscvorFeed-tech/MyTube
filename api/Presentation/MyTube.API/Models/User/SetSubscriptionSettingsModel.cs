namespace MyTube.API.Models.User
{
    public class SetSubscriptionSettingsModel : BaseAuthorizedModel
    {

        public bool? Subscription { get; set; }

        public double? Amount { get; set; }

    }

}
