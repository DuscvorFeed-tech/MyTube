namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalBillingCycle
    {

        public PaypalPricingScheme pricing_scheme { get; set; }

        public PaypalFrequency frequency { get; set; }

        public string tenure_type { get; set; }

        public int sequence { get; set; }

        public int total_cycles { get; set; }

    }

}
