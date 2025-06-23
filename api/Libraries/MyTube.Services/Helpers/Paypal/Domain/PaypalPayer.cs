namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalPayer
    {

        public PaypalName name { get; set; }
        
        public string email_address { get; set; }
        
        public string payer_id { get; set; }
    
        public PaypalAddress address { get; set; }

    }

}
