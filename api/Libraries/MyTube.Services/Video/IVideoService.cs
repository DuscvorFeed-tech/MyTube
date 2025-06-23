using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.Video;
using MyTube.Services.Helpers.Filter;
using MyTube.Services.Helpers.Filter.Artist;
using MyTube.Services.Helpers.Filter.Video;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Video
{
    public interface IVideoService
    {


        Task<object> GetVideoAsync(string hash);

        Task<BaseResponse> GetVideoListAsync();

        Task<object> GetVideoListAsync(VideoFilter filter);
        
        long GetVideoCount(string hash, bool useHashForPaidConentHash = false);
        
        Task<BaseResponse> InsertVideoAsync(Core.Domain.Video.Video video, VideoThumbnail videoThumbnail, string videoFileName, string selectedVideoThumbnail, IFormFile customVideoThumbnail);

        Task<BaseResponse> InsertVideoAsync(List<Core.Domain.Video.Video> videos);
        
        string GeneratePaidContentHash();
        
        long? GetVideoCount(long userId, string paidContentHash);

        Core.Domain.Video.Video GetVideo(string paidContentHash);
        
        long? GetVideoCount(long? id);

        long? GetVideoCountByIdAndArtist(long? id, string artist);

        Core.Domain.Video.Video GetVideoForSubscriber(string paidContentHash, long userId);
        
        Task<object> GetListAsync(ArtistVideoFilter filter);

    }
}
