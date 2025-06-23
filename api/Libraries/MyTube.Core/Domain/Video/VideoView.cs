using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.Video
{

    [Table("video_view")]
    public class VideoView : BaseDomain
    {

        [Required]
        public long VideoId { get; set; }

        public long? UserId { get; set; }

        [Required]
        public string IpAddress { get; set; }

        public DateTime? DateWatched { get; set; }

        public virtual Video Video { get; set; }

    }
}
