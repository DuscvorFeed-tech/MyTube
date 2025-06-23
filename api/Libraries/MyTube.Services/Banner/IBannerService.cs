using System.Threading.Tasks;

namespace MyTube.Services.Banner
{
    public interface IBannerService
    {
        Task<object> GetListAsync(int? displayRecord, bool? liveTicket);
    }
}
