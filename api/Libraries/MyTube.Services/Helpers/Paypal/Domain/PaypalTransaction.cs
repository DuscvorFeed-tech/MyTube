using System;

namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalTransaction
    {
        public string status { get; set; }

        public string id { get; set; }

        public PaypalAmountWithBreakdown amount_with_breakdown { get; set; }

        public PaypalName payer_name { get; set; }

        public string payer_email { get; set; }

        public DateTime time { get; set; }

    }

}
