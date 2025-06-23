using MyTube.Core.Domain.Video.Enums;

namespace MyTube.Services.Helpers.Filter.Video
{
    public class VideoFilter : FilterHelper
    {

        public virtual FilterType FilterType { get; }

        /// <summary>
        /// Search videos by video type
        /// </summary>
        public VideoType? VideoType { get; set; }

        public VideoOrderByType? OrderBy { get; set; }

        public OrderType? OrderType { get; set; }

    }

}
