using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.CronSchedules;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.CronSchedules
{
    public class CronScheduleService : ICronScheduleService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public CronScheduleService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public async Task<CronSchedule> GetAsync(string name, bool active = true)
        {
            try
            {

                return await _dataContext.CronSchedules.AsNoTracking()
                                    .Where(p =>
                                                p.Name.Equals(name, StringComparison.OrdinalIgnoreCase) &&
                                                p.Active == active)
                                    .SingleOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from cron_schedule table: {ex}");
                _logger.Debug($"WHERE Name={name} AND Active={active}");
            }

            return null;

        }

        public async Task UpdateAsync(CronSchedule entity)
        {
            try
            {
                _dataContext.CronSchedules.Update(entity);
                await _dataContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update cron_schedule record: {ex}");
            }
        }

        public async Task UpdateAsync(long id, DateTime? lastRun, DateTime? lastSuccessfulRun)
        {
            try
            {

                var entity = await _dataContext.CronSchedules
                                    .Where(p =>
                                                p.Id == id)
                                    .SingleOrDefaultAsync();

                if (entity != null)
                {
                    entity.LastRun = lastRun;
                    if (lastSuccessfulRun.HasValue)
                    {
                        entity.LastSuccessfulRun = lastSuccessfulRun;
                    }

                    try
                    {
                        _dataContext.CronSchedules.Update(entity);
                        await _dataContext.SaveChangesAsync();
                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update cron_schedule record: {ex1}");
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from cron_schedule table: {ex}");
                _logger.Debug($"WHERE Id={id}");
            }
        }

    }
}
