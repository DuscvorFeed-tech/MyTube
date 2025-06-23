namespace MyTube.API.Models.Paypal
{
    public class CreateArtistSubscriptionPurchaseModel
    {

        public string Artist { get; set; }

        public string ReturnUrl { get; set; }

        public string CancelUrl { get; set; }

    }
}
