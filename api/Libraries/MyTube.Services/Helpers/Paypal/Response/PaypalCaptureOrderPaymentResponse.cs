using System;
using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalCaptureOrderPaymentResponse
    {

        public string id { get; set; }
        
        public PaypalAmount amount { get; set; }
        
        public bool final_capture { get; set; }

        public PaypalSellerProtection seller_protection { get; set; }
        
        public string disbursement_mode { get; set; }
        
        public PaypalAmountWithBreakdown seller_receivable_breakdown { get; set; }
        
        public string status { get; set; }
        
        public DateTime create_time { get; set; }
        
        public DateTime update_time { get; set; }
        
        public PaypalLink[] links { get; set; }

    }

}
