using System;
using System.Threading.Tasks;
using MyTube.Core.Domain.CronSchedules;

namespace MyTube.Services.CronSchedules
{
    public interface ICronScheduleService
    {

        Task<CronSchedule> GetAsync(string name, bool active = true);
        
        Task UpdateAsync(CronSchedule entity);

        Task UpdateAsync(long id, DateTime? lastRun, DateTime? lastSuccessfulRun);

    }

}
