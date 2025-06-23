using System.Threading.Tasks;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Zoom
{
    public interface IZoomFetcherLogService
    {

        Task<BaseResponse> InsertOrUpdateZoomFetcherLog(Core.Domain.Zoom.ZoomFetcherLog zoomFetcherLog);

    }
}
