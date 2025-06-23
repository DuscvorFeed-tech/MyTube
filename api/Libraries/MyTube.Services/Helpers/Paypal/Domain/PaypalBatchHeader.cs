namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalBatchHeader
    {
        public string payout_batch_id { get; set; }
        
        public string batch_status { get; set; }

        public string time_created { get; set; }

        public string time_completed { get; set; }


        public PaypalSenderBatchHeader sender_batch_header { get; set; }

        public string funding_source { get; set; }

        public PaypalAmount amount { get; set; }

        public PaypalAmount fees { get; set; }


    }

}
