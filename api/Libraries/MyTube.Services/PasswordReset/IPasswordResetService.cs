using System;
using System.Threading.Tasks;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.PasswordReset
{
    public interface IPasswordResetService
    {
        
        Task<BaseResponse> ForgotPasswordAsync(string email);

        Task<BaseResponse> InsertPasswordResetAsync(Core.Domain.PasswordReset.PasswordReset passwordReset);

        Task<BaseResponse> ForgotPasswordConfirmationAsync(string key, string confirmationCode);

        long GetPasswordResetCount(string key, string confirmationResetCode, Core.Domain.User.Enums.UserStatusType userStatusType);
        
        Task<BaseResponse> ResetPasswordAsync(string password, string key, string resetCode);

    }
}
