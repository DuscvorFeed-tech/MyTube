using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace MyTube.Services.File
{
    public interface IFileService
    {
        
        Task<object> Upload(long userId, IFormFile videoFile);
        
        Task<object> GetVideoThumbnail(long userId, string thumbnail);

        Task<object> GetPayPerViewVideo(long userId, string couponCode, string paidContentHash, bool owner, bool subscriber);

    }
}
