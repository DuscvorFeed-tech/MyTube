using MyTube.Services.Helpers.Filter.Video;

namespace MyTube.API.Models.Video
{
    public class PayPerViewVideosModel : VideoFilter
    {

        public override FilterType FilterType => FilterType.PayPerView;

    }
}
