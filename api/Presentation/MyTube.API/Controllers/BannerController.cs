using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyTube.Services.Banner;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    public class BannerController : ControllerBase
    {

        private readonly IBannerService _service;

        public BannerController(IBannerService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> List(int? displayRecord, bool? liveTicket)
        {
            var response = await _service.GetListAsync(displayRecord, liveTicket);
            return Ok(response);
        }

    }
}
