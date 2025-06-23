using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Gpg;

namespace Zoomcording.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CronController : ControllerBase
    {

        private readonly IGpgService _gpgService;

        public CronController(IGpgService gpgService)
        {
            _gpgService = gpgService;

        }

        [HttpGet("{cronToken}/{userId}/{privateKey}")]
        [Route("gpg/key/create/{cronToken}/{userId}/{privateKey}")]
        public async Task<IActionResult> GenerateUserPublicKey(string cronToken, long? userId, string privateKey)
        {
            
            if (cronToken.HasValue() && (userId.HasValue() && userId != 0) && privateKey.HasValue())
            {
                var response = await _gpgService.GeneratePublicKeyAsync(cronToken, userId, privateKey);
                return Ok(response);
            }

            return BadRequest();

        }

    }
}
