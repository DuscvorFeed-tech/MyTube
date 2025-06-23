using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.CronSchedules
{
    [Table("cron_schedule")]
    public class CronSchedule : BaseDomain
    {

        public string Name { get; set; }

        public string RunSchedule { get; set; }

        public bool Active { get; set; }

        public DateTime? LastRun { get; set; }

        public DateTime? LastSuccessfulRun { get; set; }

    }

}
