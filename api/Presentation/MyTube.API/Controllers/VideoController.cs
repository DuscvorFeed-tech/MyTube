using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MyTube.API.Helpers;
using MyTube.API.Models.Video;
using MyTube.Core.Domain.Video;
using MyTube.Services.File;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Purchase;
using MyTube.Services.User;
using MyTube.Services.Video;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VideoController : BaseAuthorizedController
    {

        private readonly IMapper _mapper;
        private readonly IVideoService _videoService;
        private readonly IVideoViewService _videoViewService;
        private readonly IFileService _fileService;
        private readonly IPurchaseCouponService _couponService;
        private readonly AppSettings _appSettings;
        private readonly IUserService _userService;

        public VideoController(IMapper mapper, IVideoService videoService,
                                IVideoViewService videoViewService, IFileService fileService,
                                IPurchaseCouponService couponService,
                                IOptions<AppSettings> appSettings, IUserService userService)
        {
            _mapper = mapper;
            _videoService = videoService;
            _videoViewService = videoViewService;
            _fileService = fileService;
            _couponService = couponService;
            _appSettings = appSettings.Value;
            _userService = userService;
        }

        #region Video List

        #region All

        [HttpGet]
        [Route("all")]
        public async Task<IActionResult> AllVideos(AllVidoesModel model)
        {
            var response = await _videoService.GetVideoListAsync(model);
            return Ok(response);
        }

        #endregion

        #region Pay Per View

        [HttpGet]
        [Route("payperview")]
        public async Task<IActionResult> PayPerViewVideos(PayPerViewVideosModel model)
        {
            var response = await _videoService.GetVideoListAsync(model);
            return Ok(response);
        }

        #endregion

        #region New

        [HttpGet]
        [Route("new")]
        public async Task<IActionResult> NewVideos(NewVidoesModel model)
        {
            var response = await _videoService.GetVideoListAsync(model);
            return Ok(response);
        }

        #endregion

        #region Trending

        [HttpGet]
        [Route("trending")]
        public async Task<IActionResult> TrendingVideos(TrendingVideosModel model)
        {
            var response = await _videoService.GetVideoListAsync(model);
            return Ok(response);
        }

        #endregion

        #endregion

        #region Video

        [HttpGet("{v}")]
        [Route("detail")]
        public async Task<IActionResult> VideoDetail(string v)
        {
            var response = await _videoService.GetVideoAsync(v);
            return Ok(response);
        }

        [HttpPost]
        [Route("view")]
        public async Task<IActionResult> VideoView([FromBody] VideoViewModel model)
        {
            var videoView = _mapper.Map<VideoView>(model);

            var response = await _videoViewService.InsertVideoViewAsync(model.Hash, videoView);

            return Ok(response);
        }

        #endregion

        #region Process and Upload Video

        [DisableRequestSizeLimit]
        [Authorize]
        [HttpPost]
        [Route("process")]
        public async Task<IActionResult> ProcessVideo(ProcessVideoModel model)
        {

            var response = await _fileService.Upload(model.UserId, model.VideoFile);

            return Ok(response);

        }

        [Authorize]
        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> UploadVideo(UploadVideoModel model)
        {

            var video = _mapper.Map<Video>(model);
            var videoThumbnail = _mapper.Map<VideoThumbnail>(model);

            var response = await _videoService.InsertVideoAsync(video, videoThumbnail, model.VideoFileName, model.VideoThumbnail, model.CustomVideoThumbnail);

            return Ok(response);

        }

        #endregion

        [Authorize]
        [HttpPost]
        [Route("paidcontent/couponcode")]
        public async Task<IActionResult> PaidContentCouponCode([FromBody]PaidContentCouponCodeModel model)
        {

            var response = await _couponService.UpdatePurchaseCouponAsync(true, model.UserId, model.CouponCode, false, null);

            return Ok(response);

        }

        #region Watch

        [HttpGet("{hash}/{token}")]
        [Route("~/watch/{hash}/{token}")]
        public async Task<IActionResult> Watch(string hash, string token)
        {
            return await GetVideo(null, hash, token, true, false);

        }

        [HttpGet("{hash}/{token}")]
        [Route("~/watch/subscriber/{hash}/{token}")]
        public async Task<IActionResult> WatchSubscriber(string hash, string token)
        {
            return await GetVideo(null, hash, token, false, true);

        }


        [HttpGet("{couponCode}/{hash}/{token}")]
        [Route("~/watch/paid/{couponCode}/{hash}/{token}")]
        public async Task<IActionResult> WatchPaid(string couponCode, string hash, string token)
        {

            return await GetVideo(couponCode, hash, token, false, false);
        }

        private async Task<IActionResult> GetVideo(string couponCode, string hash, string token, bool owner, bool subscriber)
        {
            var user = await GetUserAsync(_userService, _appSettings.Secret, token);
            if (user != null)
            {

                var response = await _fileService.GetPayPerViewVideo(user.Id, couponCode, hash, owner, subscriber);
                if (response != null)
                {
                    return File((byte[])response, "video/mp4", true);
                }
            }

            return BadRequest(new ErrorResponse("CouponCode", MessageHelper.Invalid, ErrorCodes.Invalid));
        }

        #endregion

    }
}
