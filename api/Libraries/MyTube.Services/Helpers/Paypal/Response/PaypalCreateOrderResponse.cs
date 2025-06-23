using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalCreateOrderResponse
    {

        public string id { get; set; }

        public string status { get; set; }

        public PaypalLink[] links { get; set; }

    }
}
