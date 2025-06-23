using MyTube.Services.Helpers.Filter.Webinar;

namespace MyTube.API.Models.Webinar
{
    public class ListWebinarsModel : WebinarFilter
    {

        public override FilterType FilterType => FilterType.List;

    }
}
