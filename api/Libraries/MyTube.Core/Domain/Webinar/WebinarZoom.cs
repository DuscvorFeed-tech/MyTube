using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Webinar
{

    [Table("webinar_zoom")]
    public class WebinarZoom : BaseDomain
    {

        [Required]
        public long WebinarId { get; set; }

        [Required]
        public long Zoom_id { get; set; }

        [Required]
        public string Zoom_uuid { get; set; }

        [Required]
        public string Zoom_join_url { get; set; }

        [Required]
        public string Zoom_start_url { get; set; }

        public virtual Webinar Webinar { get; set; }

    }
}
