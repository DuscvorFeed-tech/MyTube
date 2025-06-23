using MyTube.Services.Helpers.Filter.Artist;

namespace MyTube.API.Models.Artist
{
    public class ArtistPageModel : ArtistFilter
    {

        public override FilterType FilterType => FilterType.Artist;

    }
}
