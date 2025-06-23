namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalPaymentPreferences
    {

        public string setup_fee_failure_action { get; set; }

        public int payment_failure_threshold { get; set; }

    }
}
