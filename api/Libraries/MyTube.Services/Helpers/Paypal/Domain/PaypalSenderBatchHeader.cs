namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalSenderBatchHeader
    {

        public string sender_batch_id { get; set; }

        public string email_subject { get; set; }

        public string email_message { get; set; }

    }
}
