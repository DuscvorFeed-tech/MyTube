using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyTube.API.Helpers;
using MyTube.API.Models.Paypal;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Services.Paypal;

namespace MyTube.API.Controllers
{
    [Route("payment/[controller]")]
    [ApiController]
    public class PaypalController : ControllerBase
    {

        private readonly IPaypalService _paypalService;

        public PaypalController(IPaypalService paypalService)
        {
            _paypalService = paypalService;
        }


        #region Pay Per View

        [Authorize]
        [HttpPost]
        [Route("payperview/purchase")]
        public async Task<IActionResult> CreatePayPerViewPurchase([FromBody]CreatePayperviewPurchaseModel model)
        {
            var response = await _paypalService.InsertPurchaseAsync(PurchaseType.PayPerView, PaymentType.Paypal, model.PaidContentHash, model.ReturnUrl, model.CancelUrl);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("{token}")]
        [Route("payperview/purchase/{token}")]
        public async Task<IActionResult> UpdatePayPerViewPurchase(string token)
        {
            var response = await _paypalService.UpdatePurchaseAsync(PurchaseType.PayPerView, token);
            return Ok(response);
        }

        #endregion

        #region Live Ticket

        [Authorize]
        [HttpPost]
        [Route("liveticket/purchase")]
        public async Task<IActionResult> CreateLiveTicketPurchase([FromBody] CreateLiveTicketPurchaseModel model)
        {
            var response = await _paypalService.InsertPurchaseAsync(PurchaseType.LiveTicket, PaymentType.Paypal, model.LiveTicketHash, model.ReturnUrl, model.CancelUrl);
            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        [Route("liveticket/purchase/confirm")]
        public async Task<IActionResult> UpdateLiveTicketPurchase([FromBody] UpdateLiveTicketPurchaseModel model)
        {
            var response = await _paypalService.UpdatePurchaseAsync(PurchaseType.LiveTicket, model.Token);
            return Ok(response);
        }

        #endregion

        #region Artist Subscription

        [Authorize]
        [HttpPost]
        [Route("artist/subscription/purchase")]
        public async Task<IActionResult> CreateArtistSubscriptionPurchase([FromBody] CreateArtistSubscriptionPurchaseModel model)
        {
            var response = await _paypalService.InsertPurchaseAsync(PurchaseType.Subscription, PaymentType.Paypal, model.Artist, model.ReturnUrl, model.CancelUrl);
            return Ok(response);
        }

        [Authorize]
        [HttpPost("{subscriptionId}")]
        [Route("artist/subscription/purchase/{subscriptionId}")]
        public async Task<IActionResult> UpdateArtistSubscriptionPurchase(string subscriptionId)
        {
            var response = await _paypalService.UpdatePurchaseAsync(PurchaseType.Subscription, subscriptionId);
            return Ok(response);
        }

        #endregion

    }

}
