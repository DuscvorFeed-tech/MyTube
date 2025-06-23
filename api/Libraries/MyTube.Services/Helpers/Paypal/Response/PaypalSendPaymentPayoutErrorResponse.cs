namespace MyTube.Services.Helpers.Paypal.Response
{
    public class PaypalSendPaymentPayoutErrorResponse
    {
        public string name { get; set; }
        public string message { get; set; }
        public string debug_id { get; set; }
        public string information_link { get; set; }
        public Detail[] details { get; set; }
        public object[] links { get; set; }
    }

    public class Detail
    {
        public string field { get; set; }
        public string location { get; set; }
        public string issue { get; set; }
        public Link[] link { get; set; }
    }

    public class Link
    {
        public string href { get; set; }
        public string rel { get; set; }
        public string method { get; set; }
        public string encType { get; set; }
    }

}
