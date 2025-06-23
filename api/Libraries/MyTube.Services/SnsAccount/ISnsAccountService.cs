using System.Threading.Tasks;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.SnsAccount
{
    public interface ISnsAccountService
    {

        Task<object> GetSnsAccountAsync();

        Task<BaseResponse> AddUpdateSnsAccountAsync(Core.Domain.SnsAccount.SnsAccount snsAccount);

    }
}
