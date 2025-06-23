namespace MyTube.Core.Domain.Purchase.Enums
{
    public enum SubscriptionEmailStatusType
    {

        None = 0,

        ForSendingWaitingPaymentEmail = 1,

        WaitingPaymentEmailSent = 2,

        ForSendingPaymentConfirmedEmail = 3,

        PaymentConfirmedEmailSent = 4,
        
    }
}
