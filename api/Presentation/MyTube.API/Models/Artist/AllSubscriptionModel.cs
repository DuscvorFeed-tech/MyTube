using MyTube.Services.Helpers.Filter.Artist;

namespace MyTube.API.Models.Artist
{
    public class AllSubscriptionModel : ArtistFilter
    {

        public override FilterType FilterType => FilterType.All;

    }
}
