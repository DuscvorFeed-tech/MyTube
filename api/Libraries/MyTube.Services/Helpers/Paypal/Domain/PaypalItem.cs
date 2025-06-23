namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalItem
    {

        public string recipient_type { get; set; }
        
        public PaypalAmount amount { get; set; }
        
        public string note { get; set; }
        
        public string sender_item_id { get; set; }
        
        public string receiver { get; set; }
        
        public PaypalAlternateNotificationMethod alternate_notification_method { get; set; }

        public string notification_language { get; set; }

    }
}
