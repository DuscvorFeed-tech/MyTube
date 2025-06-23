namespace MyTube.Services.Helpers.Settings
{
    public class PaypalSettings_v2
    {

        public bool IsSandbox { get; set; }

        public string LiveUrl { get; set; }

        public string SandboxUrl { get; set; }

        public string ClientId { get; set; }

        public string Secret { get; set; }

        public string Currency { get; set; }

        public string GenerateTokenUrl { get; set; }
        public string GetGenerateTokenUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), GenerateTokenUrl);
            }
        }

        public string CreateOrderUrl { get; set; }
        public string GetCreateOrderUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), CreateOrderUrl);
            }
        }


        public string AuthorizeOrderPaymentUrl { get; set; }
        public string GetAuthorizeOrderPaymentUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), AuthorizeOrderPaymentUrl);
            }
        }


        public string CaptureOrderPaymentUrl { get; set; }
        public string GetCaptureOrderPaymentUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), CaptureOrderPaymentUrl);
            }
        }


        public string VoidOrderPaymentUrl { get; set; }
        public string GetVoidOrderPaymentUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), VoidOrderPaymentUrl);
            }
        }

        public string CatalogsProductsUrl { get; set; }
        public string GetCatalogsProductsUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), CatalogsProductsUrl);
            }
        }

        public string BillingPlansUrl { get; set; }
        public string GetBillingPlansUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), BillingPlansUrl);
            }
        }

        public string ProductId { get; set; }

        public string ProductName { get; set; }

        public string ProductDescription { get; set; }

        public string PlanName { get; set; }

        public string ProductType { get; set; }

        public string CreateSubscriptionUrl { get; set; }

        public string GetCreateSubscriptionUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), CreateSubscriptionUrl);
            }
        }

        public string SubscriptionDetailsUrl { get; set; }

        public string GetSubscriptionDetailsUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), SubscriptionDetailsUrl);
            }
        }

        public string SubscriptionTransactionListUrl { get; set; }

        public string GetSubscriptionTransactionListUrl
        {
            get
            {
                return string.Format("{0}{1}", (IsSandbox == true ? SandboxUrl : LiveUrl), SubscriptionTransactionListUrl);
            }
        }

        public string PaymentRefundDetailsRoute { get; set; }
        public string PaymentRefundNoteToPayerRoute { get; set; }
        public string PaymentRefundRoute { get; set; }
        public string PaymentsPayoutsRoute { get; set; }

        public string SenderBatchHeaderAutoPayEmailMessage { get; set; }
        public string SenderBatchHeaderAutoPayEmailSubject { get; set; }

        public string SenderBatchIdLengthArtistAutoPayment { get; set; }

        public string SenderBatchIdLengthArtistManualPayment { get; set; }

        public string SubscriptionCancelRoute { get; set; }

    }

}
