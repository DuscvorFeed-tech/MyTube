using MyTube.Services.Helpers.Filter.Webinar;

namespace MyTube.API.Models.Webinar
{
    public class LiveTicketsModel : WebinarFilter
    {

        public override FilterType FilterType => FilterType.LiveTicket;

    }
}
