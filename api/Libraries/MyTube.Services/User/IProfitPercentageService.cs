using System.Threading.Tasks;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.User
{
    public interface IProfitPercentageService
    {

        void SetSysSettings();

        Task<BaseResponse> InsertProfitPercentageAsync(long userId);

    }
}
