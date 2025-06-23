using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.Caches.Enums;

namespace MyTube.Core.Domain.Caches
{

    [Table("cache")]
    public class Cache : BaseDomain
    {

        public CacheType Type { get; set; }

        public string Value1 { get; set; }

        public string Value2 { get; set; }

    }
}
