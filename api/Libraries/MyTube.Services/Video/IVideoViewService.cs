using System.Threading.Tasks;
using MyTube.Core.Domain.Video;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Video
{
    public interface IVideoViewService
    {
        
        Task<BaseResponse> InsertVideoViewAsync(string hash, VideoView videoView);

    }
}
