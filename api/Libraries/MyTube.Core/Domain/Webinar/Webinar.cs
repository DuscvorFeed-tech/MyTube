using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.Zoom;
using MyTube.Core.Domain.Video.Enums;
using MyTube.Core.Domain.Webinar.Enums;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.Webinar
{

    [Table("webinar")]
    public class Webinar : BaseDomain
    {

        [Required]
        public long ZoomAppId { get; set; }

        [Required]
        public long CreatedBy { get; set; }

        [Required]
        [MaxLength(LengthHelper.ZoomWebinar_LiveName_MaxLength)]
        public string LiveName { get; set; }

        [Required]
        public DateTime WebinarStart { get; set; }

        [Required]
        public int? DurationHour { get; set; }

        [Required]
        public int? DurationMinute { get; set; }

        [Required]
        public VideoType? VideoType { get; set; }

        [Required]
        public bool TopPageAnnouncement { get; set; }

        public bool YoutubeLive { get; set; }

        public bool PaidContent { get; set; }

        public double? PaidContentPrice { get; set; }

        public double? PaidContentFilPrice { get; set; }

        public string PaidContentHash { get; set; }

        public bool LiveTicket { get; set; }

        public double? LiveTicketPrice { get; set; }

        public double? LiveTicketFilPrice { get; set; }

        public string LiveTicketHash { get; set; }

        public int? MaxLiveTicket { get; set; }

        public int? LiveTicketRemaining { get; set; }

        [MaxLength(LengthHelper.ZoomWebinar_Agenda_MaxLength)]
        public string Agenda { get; set; }

        [Required]
        public WebinarType WebinarType { get; set; }

        [Required]
        [MaxLength(LengthHelper.ZoomWebinar_Password_MaxLength)]
        public string Password { get; set; }

        [MaxLength(LengthHelper.Video_Hash_MaxLength)]
        public string Hash { get; set; }

        [MaxLength(LengthHelper.ZoomWebinar_YoutubeUrl_MaxLength)]
        public string YoutubeUrl { get; set; }

        public WebinarStatusType WebinarStatusType { get; set; }

        public ApprovalEmailStatus? ApprovalEmailStatus { get; set; }

        public bool Active { get; set; }

        public virtual ZoomApp ZoomApp { get; set; }

        public virtual User.User CreatedByUser { get; set; }

        public virtual WebinarZoom WebinarZoom { get; set; }

        public virtual ICollection<WebinarPerformer> Performers { get; set; }

        public virtual ICollection<WebinarZoomRecording> Recordings { get; set; }

    }
}
