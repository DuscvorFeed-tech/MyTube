using MyTube.Services.Helpers.Paypal.Domain;

namespace MyTube.Services.Helpers.Paypal.Request
{
    public class PaypalOrder
    {

        public string intent { get; set; }

        public PaypalApplicationContext application_context { get; set; }

        public PaypalOrderPurchaseUnits[] purchase_units { get; set; }

    }

}
