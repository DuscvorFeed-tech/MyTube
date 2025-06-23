using MyTube.Services.Helpers.Filter.Video;

namespace MyTube.API.Models.Video
{
    public class TrendingVideosModel : VideoFilter
    {

        public override FilterType FilterType => FilterType.Trending;

    }
}
