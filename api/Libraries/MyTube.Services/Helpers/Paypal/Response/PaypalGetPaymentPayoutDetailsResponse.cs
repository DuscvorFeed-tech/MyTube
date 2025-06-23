using System;
using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalGetPaymentPayoutDetailsResponse
    {

        public PaypalBatchHeader batch_header { get; set; }
        
        public PaypalGetPaymentPayoutDetails_Item[] items { get; set; }

        public PaypalLink[] links { get; set; }

    }

    public class PaypalGetPaymentPayoutDetails_Item
    {
        public string payout_item_id { get; set; }
        public string transaction_id { get; set; }
        public string activity_id { get; set; }
        public string transaction_status { get; set; }
        public PaypalAmount payout_item_fee { get; set; }
        public string payout_batch_id { get; set; }
        public PaypalPayoutItem payout_item { get; set; }
        public string time_processed { get; set; }
        public PaypalLink[] links { get; set; }
        public Errors errors { get; set; }
    }


    public class PaypalPayoutItem
    {
        public string recipient_type { get; set; }
        public PaypalAmount amount { get; set; }
        public string receiver { get; set; }
        public string sender_item_id { get; set; }
        public string recipient_wallet { get; set; }
    }

    public class Errors
    {
        public string name { get; set; }
        public string message { get; set; }
        public string information_link { get; set; }
        public object[] details { get; set; }
    }


}
