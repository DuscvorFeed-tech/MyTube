using MyTube.Services.Helpers.Filter.Video;

namespace MyTube.API.Models.Video
{
    public class NewVidoesModel : VideoFilter
    {

        public override FilterType FilterType => FilterType.New;

    }
}
