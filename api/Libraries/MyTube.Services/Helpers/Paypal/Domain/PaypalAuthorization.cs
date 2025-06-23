using System;

namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalAuthorization
    {

        public string status { get; set; }

        public string id { get; set; }
        
        public PaypalAmount amount { get; set; }
        
        public PaypalSellerProtection seller_protection { get; set; }
        
        public DateTime expiration_time { get; set; }
        
        public PaypalLink[] links { get; set; }
        
        public DateTime create_time { get; set; }
        
        public DateTime update_time { get; set; }

    }

}
