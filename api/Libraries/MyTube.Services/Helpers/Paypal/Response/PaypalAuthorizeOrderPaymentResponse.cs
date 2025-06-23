using System;
using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalAuthorizeOrderPaymentResponse
    {
        public string id { get; set; }

        public string intent { get; set; }

        public string status { get; set; }

        public PaypalPurchaseUnits[] purchase_units { get; set; }

        public PaypalPayer payer { get; set; }

        public DateTime create_time { get; set; }

        public DateTime update_time { get; set; }

        public PaypalLink[] links { get; set; }

    }

}
