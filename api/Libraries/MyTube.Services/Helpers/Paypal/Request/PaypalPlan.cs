using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Request
{
    public class PaypalPlan
    {

        public string product_id { get; set; }

        public string name { get; set; }

        public string description { get; set; }

        public string status { get; set; }

        public PaypalBillingCycle[] billing_cycles { get; set; }

        public PaypalPaymentPreferences payment_preferences { get; set; }


    }

}
