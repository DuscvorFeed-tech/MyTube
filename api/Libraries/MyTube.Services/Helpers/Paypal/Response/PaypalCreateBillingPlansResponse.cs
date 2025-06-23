using System;
using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalCreateBillingPlansResponse
    {

        public string id { get; set; }

        public string product_id { get; set; }

        public string name { get; set; }

        public string status { get; set; }

        public string usage_type { get; set; }

        public PaypalBillingCycle[] billing_cycles { get; set; }

        public PaypalPaymentPreferences payment_preferences { get; set; }

        public bool quantity_supported { get; set; }

        public DateTime create_time { get; set; }

        public DateTime update_time { get; set; }

        public PaypalLink[] links { get; set; }

    }
}
