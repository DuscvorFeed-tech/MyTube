using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MyTube.Services.File;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.User;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FilesController : BaseAuthorizedController
    {
        private readonly AppSettings _appSettings;
        private readonly IUserService _userService;
        private readonly IFileService _fileService;

        public FilesController(IOptions<AppSettings> appSettings,
                               IUserService userService, IFileService fileService)
        {
            _appSettings = appSettings.Value;
            _userService = userService;
            _fileService = fileService;
        }

        [HttpGet("{thumbnail}/{token}")]
        [Route("~/video/thumbnail/temp/{thumbnail}/{token}")]
        public async Task<IActionResult> VideoThumbnail(string thumbnail, string token)
        {

            var user = await GetUserAsync(_userService, _appSettings.Secret, token);
            if (user != null)
            {

                var response = await _fileService.GetVideoThumbnail(user.Id, thumbnail);

                if (response != null)
                {
                    return File((byte[])response, "image/png");
                }
            }

            return BadRequest();

        }

    }
}