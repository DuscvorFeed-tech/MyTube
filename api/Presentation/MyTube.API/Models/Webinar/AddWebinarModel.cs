using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;

namespace MyTube.API.Models.Webinar
{
    public class AddWebinarModel : BaseAuthorizedModel
    {

        public string LiveName { get; set; }

        public IFormFile AnnouncementImage { get; set; }

        public DateTime? WebinarStart { get; set; }

        public int? DurationHour { get; set; }

        public int? DurationMinute { get; set; }

        public List<string> Performer { get; set; }

        public int? VideoType { get; set; }

        public bool? TopPageAnnouncement { get; set; }

        public bool? YoutubeLive { get; set; }

        public bool? PaidContent { get; set; }

        public double? PaidContentPrice { get; set; }

        public double? PaidContentFilPrice { get; set; }

        public bool? LiveTicket { get; set; }

        public double? LiveTicketPrice { get; set; }

        public double? LiveTicketFilPrice { get; set; }

        public int? MaxLiveTicket { get; set; }

        public string Agenda { get; set; }

        public string YoutubeUrl { get; set; }

    }
}
