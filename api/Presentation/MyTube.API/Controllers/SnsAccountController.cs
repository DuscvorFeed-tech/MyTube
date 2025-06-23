using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyTube.API.Helpers;
using MyTube.API.Models.SnsAccount;
using MyTube.Core.Domain.SnsAccount;
using MyTube.Services.SnsAccount;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SnsAccountController : ControllerBase
    {

        private readonly IMapper _mapper;

        private readonly ISnsAccountService _snsAccountService;

        public SnsAccountController(IMapper mapper, ISnsAccountService snsAccountService)
        {

            _mapper = mapper;
            _snsAccountService = snsAccountService;

        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetUserSnsAccount()
        {
            var response = await _snsAccountService.GetSnsAccountAsync();

            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddUpdateSnsAccount([FromBody] AddUpdateSnsAccountModel model)
        {
            var snsAccount = _mapper.Map<SnsAccount>(model);

            var response = await _snsAccountService.AddUpdateSnsAccountAsync(snsAccount);

            return Ok(response);
        }

    }
}
