namespace MyTube.Core.Domain.User.Enums
{
    public enum UserStatusType
    {

        SendSignupConfirmationEmail = 1,

        SendSignupConfirmationEmailWithKeys = 2,

        ForConfirmation = 3,

        ForgotPasswordRequest = 4,

        ForgotPasswordEmailSent = 5,

        ForgotPasswordConfirmed = 6,

        Active = 7,

        Inactive = 8,

    }
}
