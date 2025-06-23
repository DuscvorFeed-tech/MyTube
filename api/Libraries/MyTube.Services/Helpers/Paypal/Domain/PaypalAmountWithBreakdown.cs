namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalAmountWithBreakdown
    {

        public PaypalAmount gross_amount { get; set; }
        
        public PaypalAmount paypal_fee { get; set; }

        public PaypalAmount net_amount { get; set; }

        public PaypalAmount fee_amount { get; set; }

    }
}
