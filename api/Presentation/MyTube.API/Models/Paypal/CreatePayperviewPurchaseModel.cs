namespace MyTube.API.Models.Paypal
{
    public class CreatePayperviewPurchaseModel
    {

        public string PaidContentHash { get; set; }

        public string ReturnUrl { get; set; }

        public string CancelUrl { get; set; }

    }
}
