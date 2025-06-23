using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Caches;
using MyTube.Core.Domain.Caches.Enums;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Caches
{
    public class CacheService : ICacheService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public CacheService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public async Task<Cache> GetAsync(CacheType type)
        {
            
            try
            {

                return await _dataContext.Caches.AsNoTracking()
                                    .Where(p =>
                                                p.Type == type)
                                    .SingleOrDefaultAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from cache table: {ex}");
                _logger.Debug($"WHERE Type={(int)type}");
            }

            return null;

        }

        public async Task<bool> InsertAsync(Cache entity)
        {
            try
            {
                await _dataContext.Caches.AddAsync(entity);
                await _dataContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to cache table: {ex}");
                return false;
            }
        }

        public async Task<bool> UpdateAsync(Cache entity)
        {
            try
            {
                _dataContext.Caches.Update(entity);
                await _dataContext.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update cache record: {ex}");
                return false;
            }
        }

    }
}
