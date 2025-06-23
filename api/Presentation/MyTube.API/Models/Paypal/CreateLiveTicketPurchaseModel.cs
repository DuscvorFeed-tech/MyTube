namespace MyTube.API.Models.Paypal
{
    public class CreateLiveTicketPurchaseModel
    {

        public string LiveTicketHash { get; set; }

        public string ReturnUrl { get; set; }

        public string CancelUrl { get; set; }

    }
}
