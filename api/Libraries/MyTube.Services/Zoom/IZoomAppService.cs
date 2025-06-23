using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.Zoom;
using MyTube.Core.Domain.User;
using MyTube.Core.Domain.User.Enums;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Zoom
{
    public interface IZoomAppService
    {

        Task<BaseResponse> InsertZoomAppAsync(ZoomApp app);

        Task<object> GetZoomAppAsync();

        Task<ZoomApp> GetZoomAppAsync(long id, bool idIsEqualToUserId, bool findCreatorSharedZoomApp);

        int GetZoomAppCount(string apiKey, string apiSecret);
        
        int GetZoomAppCount(long id, bool idIsEqualToUserId);
        
        long GetZoomAppCount(UserType creator);
        
        Task<List<ZoomApp>> GetZoomAppListAsync();

    }

}
