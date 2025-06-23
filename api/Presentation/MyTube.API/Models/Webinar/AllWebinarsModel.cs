using MyTube.Services.Helpers.Filter.Webinar;

namespace MyTube.API.Models.Webinar
{
    public class AllWebinarsModel : WebinarFilter
    {

        public override FilterType FilterType => FilterType.All;

    }
}
