using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyTube.API.Helpers;
using MyTube.API.Models.App;
using MyTube.Core.Domain.Zoom;
using MyTube.Services.Zoom;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AppController : ControllerBase
    {

        #region Fields

        private readonly IMapper _mapper;
        private readonly IZoomAppService _zoomAppService;

        #endregion

        #region Constructor

        public AppController(IMapper mapper, IZoomAppService zoomAppService)
        {
            _mapper = mapper;
            _zoomAppService = zoomAppService;
        }

        #endregion

        #region Get Zoom App

        [Authorize]
        [HttpGet]
        [Route("zoom")]
        public async Task<IActionResult> ZoomAppGet()
        {

            var response = await _zoomAppService.GetZoomAppAsync();

            return Ok(response);

        }

        #endregion

        #region Add Zoom App

        [Authorize]
        [HttpPost]
        [Route("zoom")]
        public async Task<IActionResult> ZoomAppAdd([FromBody] ZoomAddModel model)
        {

            var entity = _mapper.Map<ZoomApp>(model);

            var response = await _zoomAppService.InsertZoomAppAsync(entity);

            return Ok(response);

        }

        #endregion

    }
}
