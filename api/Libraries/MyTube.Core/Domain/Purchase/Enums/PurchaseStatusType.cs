namespace MyTube.Core.Domain.Purchase.Enums
{
    public enum PurchaseStatusType
    {

        Created = 1,

        Captured = 2,

        WaitingForPayment = 3,

        Paid = 4,

        CouponCodeSent = 5,

        Active = 6,

        Canceled = 7,

    }
}
