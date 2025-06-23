using System.Threading.Tasks;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.RegistrationCode
{
    public interface IRegistrationCodeService
    {
        
        Task InsertRegistrationCodeAsync(Core.Domain.RegistrationCode.RegistrationCode registrationCode);

        int GetRegistrationCodeCount(string key, string confirmationCode, bool active);
        
        Task<BaseResponse> UpdateRegistrationCodeAsync(Core.Domain.RegistrationCode.RegistrationCode registrationCode);

    }
}
