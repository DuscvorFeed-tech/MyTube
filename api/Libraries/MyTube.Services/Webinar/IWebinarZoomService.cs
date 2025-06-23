using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Webinar
{
    public interface IWebinarZoomService
    {
        
        Task<List<Core.Domain.Webinar.WebinarZoom>> GetWebinarZoomListAsync();

        Task<BaseResponse> UpdateWebinarZoomAsync(long id, string start_url);

    }
}
