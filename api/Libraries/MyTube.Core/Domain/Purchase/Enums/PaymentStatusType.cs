namespace MyTube.Core.Domain.Purchase.Enums
{
    public enum PaymentStatusType
    {

        /// <summary>
        /// Default status or Payout request was sent and received by Paypal and will be processed.
        /// </summary>
        Pending = 1,

        /// <summary>
        /// This payout request has failed, so funds were not deducted from the sender’s account.
        /// </summary>
        Failed = 2,

        /// <summary>
        /// Funds have been credited to the recipient’s account.
        /// </summary>
        Success = 3,

        /// <summary>
        /// The recipient for this payout does not have a PayPal account. A link to sign up for a PayPal account was sent to the recipient. However, if the recipient does not claim this payout within 30 days, the funds are returned to your account.
        /// </summary>
        Unclaimed = 4,

        /// <summary>
        /// The recipient has not claimed this payout, so the funds have been returned to your account.
        /// </summary>
        Returned = 5,

        /// <summary>
        /// This payout request is being reviewed and is on hold.
        /// </summary>
        OnHold = 6,

        /// <summary>
        /// This payout request has been blocked.
        /// </summary>
        Blocked = 7,

        /// <summary>
        /// This payout request was refunded.
        /// </summary>
        Refunded = 8,

        /// <summary>
        /// This payout request was reversed.
        /// </summary>
        Reversed = 9

    }
}
