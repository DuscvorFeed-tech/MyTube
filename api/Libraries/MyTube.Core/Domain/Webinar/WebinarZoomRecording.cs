using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.Webinar.Enums;

namespace MyTube.Core.Domain.Webinar
{

    [Table("webinar_zoom_recording")]
    public class WebinarZoomRecording : BaseDomain
    {

        [Required]
        public long WebinarId { get; set; }

        [Required]
        public string FileType { get; set; }

        [Required]
        public long FileSize { get; set; }

        public TimeSpan Duration { get; set; }

        [Required]
        public DateTime RecordingStart { get; set; }

        [Required]
        public DateTime RecordingStop { get; set; }

        [Required]
        public string DownloadUrl { get; set; }

        [Required]
        public RecordingStatusType RecordingStatusType { get; set; }

        public string Hash { get; set; }

        public virtual Webinar Webinar { get; set; }

    }
}
