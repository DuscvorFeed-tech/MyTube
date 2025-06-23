using System;
using System.Collections.Generic;
using MyTube.Core.Domain.Video.Enums;
using MyTube.Core.Domain.Webinar.Enums;

namespace MyTube.Services.Helpers.Filter.Webinar
{
    public class WebinarFilter : FilterHelper
    {

        public virtual FilterType FilterType { get; }

        public VideoType? VideoType { get; set; }

        public List<WebinarStatusType?> WebinarStatus { get; set; }

        public DateTime? DateFrom { get; set; }

        public DateTime? DateTo { get; set; }

        public WebinarOrderByType? OrderBy { get; set; }

        public OrderType? OrderType { get; set; }

    }
}
