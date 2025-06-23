using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalSubscriptionTransactionListResponse
    {
        
        public PaypalTransaction[] transactions { get; set; }

        public PaypalLink[] links { get; set; }

    }

}
