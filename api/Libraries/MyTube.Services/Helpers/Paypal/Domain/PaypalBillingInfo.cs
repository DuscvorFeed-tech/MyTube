using System;

namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalBillingInfo
    {

        public PaypalAmount outstanding_balance { get; set; }
        
        public PaypalCycleExecution[] cycle_executions { get; set; }
        
        public PaypalLastPayment last_payment { get; set; }
        
        public string next_billing_time { get; set; }

        public int failed_payments_count { get; set; }

    }

}
