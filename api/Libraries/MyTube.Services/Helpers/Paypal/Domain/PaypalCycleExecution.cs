namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalCycleExecution
    {

        public string tenure_type { get; set; }
        
        public int sequence { get; set; }
        
        public int cycles_completed { get; set; }
        
        public int cycles_remaining { get; set; }
        
        public int current_pricing_scheme_version { get; set; }

        public int total_cycles { get; set; }

    }
}
