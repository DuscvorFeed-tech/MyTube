using System;
using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalGetSubscriptionDetailsResponse
    {
        
        public string status { get; set; }

        public string id { get; set; }
        
        public string plan_id { get; set; }
        
        public string start_time { get; set; }
        
        public string quantity { get; set; }
        
        public PaypalSubscriber subscriber { get; set; }

        public PaypalBillingInfo billing_info { get; set; }
        
        public DateTime create_time { get; set; }
        
        public bool plan_overridden { get; set; }
        
        public PaypalLink[] links { get; set; }
    }

}
