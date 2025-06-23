using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.Video
{

    [Table("video_thumbnail")]
    public class VideoThumbnail : BaseDomain
    {

        [Required]
        public long VideoId { get; set; }

        [Required]
        [MaxLength(LengthHelper.VideoThumbnail_Thumbnail_MaxLength)]
        public string Thumbnail { get; set; }

        [Required]
        [MaxLength(LengthHelper.VideoThumbnail_Thumbnail1_MaxLength)]
        public string Thumbnail1 { get; set; }

        [Required]
        [MaxLength(LengthHelper.VideoThumbnail_Thumbnail2_MaxLength)]
        public string Thumbnail2 { get; set; }

        [Required]
        [MaxLength(LengthHelper.VideoThumbnail_Thumbnail3_MaxLength)]
        public string Thumbnail3 { get; set; }


    }
}
