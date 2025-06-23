using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyTube.Core.Domain.CommonType;
using MyTube.Services.CommonType;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class TypeController : ControllerBase
    {

        #region Fields

        private readonly ICommonTypeService _commonTypeService;

        #endregion

        #region Constructors

        public TypeController(ICommonTypeService commonTypeService)
        {
            _commonTypeService = commonTypeService;
        }

        #endregion

        #region Locale

        [HttpGet]
        [Route("locale")]
        public async Task<IActionResult> GetLocales()
        {
            
            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.LocaleType);

            return Ok(response);

        }

        #endregion

        #region User Type

        [HttpGet]
        [Route("user_type")]
        public async Task<IActionResult> GetUserTypes()
        {

            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.UserType);

            return Ok(response);

        }

        #endregion

        #region Video Type

        [HttpGet]
        [Route("video_type")]
        public async Task<IActionResult> GetVideoTypes()
        {

            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.VideoType);

            return Ok(response);

        }

        #endregion

        #region Webinar Status Type

        [HttpGet]
        [Route("webinar_status")]
        public async Task<IActionResult> GetWebinarStatusTypes()
        {

            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.WebinarStatusType);

            return Ok(response);

        }

        #endregion

        #region Webinar Duration

        [HttpGet]
        [Route("webinar_duration_hour")]
        public async Task<IActionResult> GetWebinarDurationHours()
        {

            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.WebinarDurationHour);

            return Ok(response);

        }

        [HttpGet]
        [Route("webinar_duration_minute")]
        public async Task<IActionResult> GetWebinarDurationMinutes()
        {

            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.WebinarDurationMinute);

            return Ok(response);

        }

        #endregion

        #region Order Type

        [HttpGet]
        [Route("order_type")]
        public async Task<IActionResult> GetOrderTypes()
        {

            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.OrderType);

            return Ok(response);

        }

        #endregion

        #region Webinar OrderBy Type

        [HttpGet]
        [Route("webinar_orderby_type")]
        public async Task<IActionResult> GetWebinarOrderByTypes()
        {

            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.WebinarOrderByType);

            return Ok(response);

        }

        #endregion

        #region Subscription Settings Type

        [HttpGet]
        [Route("subscription_settings")]
        public async Task<IActionResult> GetSubscriptionSettingsTypes()
        {

            var response = await _commonTypeService.GetCommonTypeListAsync(CommonTypeList.SubscriptionSettingsType);

            return Ok(response);

        }

        #endregion

    }

}
