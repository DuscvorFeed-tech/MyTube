using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalSendPaymentPayoutResponse
    {

        public PaypalBatchHeader batch_header { get; set; }
        
        public PaypalLink[] links { get; set; }

    }
}
