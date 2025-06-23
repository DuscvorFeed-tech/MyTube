using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyTube.API.Helpers;
using MyTube.API.Models.Artist;
using MyTube.Services.Helpers.Filter.Artist;
using MyTube.Services.SubscriptionSettings;
using MyTube.Services.Video;
using MyTube.Services.Webinar;

namespace MyTube.API.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class ArtistController : BaseAuthorizedController
    {

        private readonly ISubscriptionSettingsService _subscriptionSettingsService;
        private readonly IVideoService _videoService;
        private readonly IWebinarService _webinarService;

        public ArtistController(ISubscriptionSettingsService subscriptionSettingsService, IVideoService videoService,
                                IWebinarService webinarService)
        {
            _subscriptionSettingsService = subscriptionSettingsService;
            _videoService = videoService;
            _webinarService = webinarService;
        }

        [HttpGet]
        [Route("subscription/all")]
        public async Task<IActionResult> AllArtist(AllSubscriptionModel model)
        {
            var response = await _subscriptionSettingsService.FilterSubscriptionSettingsListAsync(model);
            return Ok(response);
        }

        [HttpGet()]
        [Route("subscription/page")]
        public async Task<IActionResult> ArtistPage(ArtistPageModel model)
        {
            var response = await _subscriptionSettingsService.GetArtistVideosAsync(model);
            return Ok(response);
        }
        
        [Authorize]
        [HttpGet()]
        [Route("video/list")]
        public async Task<IActionResult> ArtistVideoList([FromQuery] ArtistVideoFilter filter)
        {
            return Ok(await _videoService.GetListAsync(filter));
        }

        [Authorize]
        [HttpGet()]
        [Route("webinar/list")]
        public async Task<IActionResult> ArtistWebinarList([FromQuery] ArtistWebinarFilter filter)
        {
            return Ok(await _webinarService.GetListAsync(filter));
        }

    }

}
