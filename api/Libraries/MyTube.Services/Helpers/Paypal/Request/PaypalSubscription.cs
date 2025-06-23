using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Request
{
    public class PaypalSubscription
    {

        public string plan_id { get; set; }

        public string start_time { get; set; }

        public string quantity { get; set; }

        public PaypalSubscriber subscriber { get; set; }

        public PaypalApplicationContext application_context { get; set; }

    }
}
