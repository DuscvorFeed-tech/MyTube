using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MyTube.API.Helpers;
using MyTube.API.Models.User;
using MyTube.Core.Domain.RegistrationCode;
using MyTube.Core.Domain.User;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.Purchase;
using MyTube.Services.RegistrationCode;
using MyTube.Services.SubscriptionSettings;
using MyTube.Services.SysSettings;
using MyTube.Services.User;
using MyTube.Services.Video;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : BaseAuthorizedController
    {

        private readonly IMapper _mapper;
        private readonly IUserService _userService;
        private readonly IRegistrationCodeService _registrationCodeService;
        private readonly IVideoService _videoService;
        private readonly ISubscriptionSettingsService _subscriptionSettingsService;
        private readonly IPurchaseService _purchaseService;
        private readonly ISysSettingsService _sysSettingsService;
        private readonly IWeRaveYouLog _logger;

        public UserController(IMapper mapper, IUserService userService,
                                IRegistrationCodeService registrationCodeService, IVideoService videoService,
                                ISubscriptionSettingsService subscriptionSettingsService,
                                IPurchaseService purchaseService, ISysSettingsService sysSettingsService,
                                IWeRaveYouLog logger)
        {
            _mapper = mapper;
            _userService = userService;
            _registrationCodeService = registrationCodeService;
            _videoService = videoService;
            _subscriptionSettingsService = subscriptionSettingsService;
            _purchaseService = purchaseService;
            _sysSettingsService = sysSettingsService;
            _logger = logger;
        }

        #region Signup

        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpModel model)
        {

            var user = _mapper.Map<User>(model);

            var response = await _userService.InsertUserAsync(user, model.Password, model.SecuredFileTransfer);

            return Ok(response);

        }

        [HttpGet]
        [Route("signup/confirmation")]
        public async Task<IActionResult> SignUpConfirmation([FromQuery] SignUpConfirmationModel model)
        {

            var mappedRegistrationCode = _mapper.Map<RegistrationCode>(model);

            var response = await _registrationCodeService.UpdateRegistrationCodeAsync(mappedRegistrationCode);

            return Ok(response);

        }

        #endregion

        #region Login

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            var response = await _userService.LoginAsync(model.EmailUsername, model.Password);

            return response;

        }

        #endregion

        #region User Profile

        [Authorize]
        [HttpGet]
        [Route("profile")]
        public async Task<IActionResult> GetProfile()
        {

            var settings = await _sysSettingsService.GetSysSettingsListAsync();
            var imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);

            var response = this.GetUserProfile(imageSettings);

            return Ok(response);

        }

        #endregion

        [Authorize]
        [HttpGet]
        [Route("uploaded/videos")]
        public async Task<IActionResult> UploadedVideos()
        {
            var response = await _videoService.GetVideoListAsync();

            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        [Route("subscription/settings")]
        public async Task<IActionResult> GetSubscriptionSettings()
        {
            var response = await _subscriptionSettingsService.GetSubscriptionSettingsAsync();

            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        [Route("subscription/settings")]
        public async Task<IActionResult> SetSubscriptionSettings([FromBody]SetSubscriptionSettingsModel model)
        {
            var response = await _subscriptionSettingsService.InsertUpdateSubscriptionSettingsAsync(model.UserId, model.Subscription, model.Amount);

            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        [Route("purchased/payperviews")]
        public async Task<IActionResult> PurchasedPayPerViews(PurchasedPayPerViewsModel filter)
        {
            var response = await _purchaseService.GetPurchaseListAsync(filter);
            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        [Route("purchased/livetickets")]
        public async Task<IActionResult> PurchasedLiveTickets(PurchasedLiveTicketsModel filter)
        {
            var response = await _purchaseService.GetPurchaseListAsync(filter);
            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        [Route("purchased/artist/subscriptions")]
        public async Task<IActionResult> PurchasedArtistSubscriptions(PurchasedArtistSubscriptionsModel filter)
        {
            var response = await _purchaseService.GetPurchaseListAsync(filter);
            return Ok(response);
        }

        [Authorize]
        [HttpPost]
        [Route("purchased/artist/subscriptions/{subscriptionId}/cancel")]
        public async Task<IActionResult> CancelPurchasedArtistSubscription(long? subscriptionId)
        {
            var response = await _purchaseService.CancelSubscription(subscriptionId);
            return Ok(response);
        }

        #region Update

        [Authorize]
        [HttpPost]
        [Route("update/profile_picture")]
        public async Task<IActionResult> UpdateProfilePicture([FromForm] UpdateProfilePictureModel model)
        {
            return Ok(await _userService.UpdateUserProfileAsync(model.UserId, model.ProfileImage));
        }

        [Authorize]
        [HttpPost]
        [Route("update/username")]
        public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameModel model)
        {
            return Ok(await _userService.UpdateUsernameAsync(model.UserId, model.Username));
        }

        #endregion


    }
}
