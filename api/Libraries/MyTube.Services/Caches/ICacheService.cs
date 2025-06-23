using System.Threading.Tasks;
using MyTube.Core.Domain.Caches;
using MyTube.Core.Domain.Caches.Enums;

namespace MyTube.Services.Caches
{
    public interface ICacheService
    {
        
        Task<Cache> GetAsync(CacheType type);

        Task<bool> InsertAsync(Cache entity);

        Task<bool> UpdateAsync(Cache entity);

    }
}
