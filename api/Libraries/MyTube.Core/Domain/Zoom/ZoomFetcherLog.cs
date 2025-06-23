using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Zoom
{
    [Table("zoom_fetcher_log")]
    public class ZoomFetcherLog : BaseDomain
    {

        [Required]
        public long ZoomAppId { get; set; }

        [Required]
        public DateTime? DateFrom { get; set; }

        [Required]
        public DateTime? DateTo { get; set; }

    }
}
