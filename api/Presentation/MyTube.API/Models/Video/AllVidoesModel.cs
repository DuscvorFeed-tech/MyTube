using MyTube.Services.Helpers.Filter.Video;

namespace MyTube.API.Models.Video
{
    public class AllVidoesModel : VideoFilter
    {

        public override FilterType FilterType => FilterType.All;

    }
}
