using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyTube.API.Helpers;
using MyTube.API.Models.Webinar;
using MyTube.Core.Domain.Webinar;
using MyTube.Services.Helpers.Filter.Webinar;
using MyTube.Services.Purchase;
using MyTube.Services.Webinar;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WebinarController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IWebinarService _webinarService;
        private readonly IPurchaseService _purchaseService;

        public WebinarController(IMapper mapper, IWebinarService webinarService,
                                    IPurchaseService purchaseService)
        {
            _mapper = mapper;
            _webinarService = webinarService;
            _purchaseService = purchaseService;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddWebinar(AddWebinarModel model)
        {
            var entity = _mapper.Map<Webinar>(model);

            var response = await _webinarService.InsertWebinarAsync(entity, model.Performer, model.UserId, model.AnnouncementImage);
            return Ok(response);
        }

        [Route("all")]
        public async Task<IActionResult> AllWebinars(AllWebinarsModel filter)
        {
            var response = await _webinarService.GetWebinarListAsync(filter);
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWebinar(long id)
        {
            var response = await _webinarService.GetWebinarAsync(id);
            return Ok(response);
        }

        [Authorize]
        [Route("list")]
        public async Task<IActionResult> ListWebinars(ListWebinarsModel filter)
        {
            var response = await _webinarService.GetWebinarListAsync(filter);
            return Ok(response);
        }

        [Authorize]
        [Route("update")]
        public async Task<IActionResult> UpdateWebinar(UpdateWebinarModel model)
        {
            var response = await _webinarService.UpdateWebinarAsync(model.Id, model.YoutubeUrl);
            return Ok(response);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWebinar(long id)
        {
            var response = await _webinarService.UpdateWebinarAsync(id, false);
            return Ok(response);
        }

        [Route("liveticket")]
        public async Task<IActionResult> LiveTickets(LiveTicketsModel filter)
        {
            var response = await _webinarService.GetWebinarListAsync(filter);
            return Ok(response);
        }

        [Route("liveticket/calendar")]
        public async Task<IActionResult> LiveTicketsCalendar(WebinarCalendarFilter filter)
        {
            var response = await _webinarService.GetWebinarCalendarListAsync(filter);
            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        [Route("liveticket/subscriber/request")]
        public async Task<IActionResult> LiveTicketSubscriberRequest([FromBody] LiveTicketSubscriberRequestModel model)
        {
            var response = await _purchaseService.LiveTicketSubscriberPurchaseAsync(model.LiveTicketHash);
            return Ok(response);
        }

    }

}
