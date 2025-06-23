using MyTube.Core.Domain.Video.Enums;

namespace MyTube.Services.Helpers.Filter.Webinar
{
    public class WebinarCalendarFilter : FilterHelper
    {

        public VideoType? VideoType { get; set; }

        public int? Year { get; set; }

        public int? Month { get; set; }

    }
}
