using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyTube.API.Helpers;
using MyTube.API.Models.FileCoin;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Services.FileCoin;

namespace MyTube.API.Controllers
{
    [Route("payment/[controller]")]
    [ApiController]
    public class FileCoinController : ControllerBase
    {
        private readonly IFileCoinService _fileCoinService;

        public FileCoinController(IFileCoinService fileCoinService)
        {
            _fileCoinService = fileCoinService;
        }

        [Authorize]
        [HttpPost]
        [Route("payperview/purchase")]
        public async Task<IActionResult> CreatePayPerViewPurchase([FromBody] CreatePayperviewPurchaseModel model)
        {
            var response = await _fileCoinService.InsertPurchaseAsync(PurchaseType.PayPerView, model.PaidContentHash);
            return Ok(response);

        }

        [Authorize]
        [HttpPost]
        [Route("liveticket/purchase")]
        public async Task<IActionResult> CreateLiveTicketPurchase([FromBody] CreateLiveTicketPurchaseModel model)
        {
            var response = await _fileCoinService.InsertPurchaseAsync(PurchaseType.LiveTicket, model.LiveTicketHash);
            return Ok(response);

        }

    }
}
