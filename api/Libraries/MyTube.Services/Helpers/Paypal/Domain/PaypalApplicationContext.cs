namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalApplicationContext
    {

        public string landing_page { get; set; }

        public string user_action { get; set; }

        public string return_url { get; set; }

        public string cancel_url { get; set; }

        public PaypalPaymentMethod payment_method { get; set; }

    }

}
