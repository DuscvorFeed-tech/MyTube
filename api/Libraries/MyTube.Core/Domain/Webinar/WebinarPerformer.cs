using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.Webinar
{


    [Table("webinar_performer")]
    public class WebinarPerformer : BaseDomain
    {

        [Required]
        public long WebinarId { get; set; }

        [Required]
        [MaxLength(LengthHelper.ZoomWebinarPerformer_Name_MaxLength)]
        public string Name { get; set; }

        public bool Active { get; set; }

    }

}
