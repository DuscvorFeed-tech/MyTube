namespace MyTube.Services.Helpers.Paypal.Domain
{
    public class PaypalPurchaseUnits
    {

        public string reference_id { get; set; }

        public PaypalAmount amount { get; set; }

        public PaypalPayee payee { get; set; }

        public PaypalShipping shipping { get; set; }

        public PaypalPayments payments { get; set; }

    }

}
