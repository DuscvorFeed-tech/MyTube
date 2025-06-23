using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Request
{
    public class PaypalPayout
    {

        public PaypalSenderBatchHeader sender_batch_header { get; set; }

        public PaypalItem[] items { get; set; }

    }
}
