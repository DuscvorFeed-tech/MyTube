using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.SysSettings
{

    [Table("sys_settings")]
    public class SysSettings : BaseDomain
    {

        [Required]
        public string Settings { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Value { get; set; }

    }
}
