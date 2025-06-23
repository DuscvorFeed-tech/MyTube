using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.CommonType;
using MyTube.Core.Domain.Video.Enums;
using MyTube.Core.Domain.Webinar;
using MyTube.Core.Domain.Webinar.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.Zoom;
using MyTube.Services.CommonType;
using MyTube.Services.Helpers.File;
using MyTube.Services.Helpers.Filter.Webinar;
using MyTube.Services.Helpers.Ipfs;
using MyTube.Services.Helpers.Key;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.ZoomApi;
using MyTube.Services.Zoom.Webinar;
using MyTube.Core.Domain.Purchase.Enums;
using System.Runtime.Serialization;
using System.Globalization;
using MyTube.Services.SysSettings;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.Helpers.Filter.Artist;
using MyTube.Services.Helpers.Filter;

namespace MyTube.Services.Webinar
{
    public class WebinarService : IWebinarService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly AppSettings _appSettings;
        private readonly ImageSettings_v2 _imageSettings;
        private readonly IpfsSettings_v2 _ipfsSettings;
        private readonly IZoomAppService _zoomAppService;
        private readonly ICommonTypeService _commonTypeService;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly VideoSettings_v2 _videoSettings;
        private readonly PaypalSettings_v2 _paypalSettings;
        private readonly ZoomSettings_v2 _zoomSettings;

        #endregion

        #region Constructor

        public WebinarService(DataContext dataContext, IWeRaveYouLog logger,
                                    IOptions<AppSettings> appSettings, 
                                    IZoomAppService zoomAppService,
                                    ICommonTypeService commonTypeService,
                                    IHttpContextAccessor contextAccessor, 
                                    ISysSettingsService sysSettingsService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _appSettings = appSettings.Value;
            _zoomAppService = zoomAppService;
            _commonTypeService = commonTypeService;
            _contextAccessor = contextAccessor;

            var settings = sysSettingsService.GetSysSettingsList();
            _paypalSettings = SysSettingsHelper.GetPaypalSettings(settings, _logger);
            _zoomSettings = SysSettingsHelper.GetZoomSettings(settings, _logger);
            _ipfsSettings = SysSettingsHelper.GetIPFSSettings(settings, _logger);
            _imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);
            _videoSettings = SysSettingsHelper.GetVideoSettings(settings, _logger);

        }

        #endregion

        public async Task<BaseResponse> InsertWebinarAsync(Core.Domain.Webinar.Webinar webinar, List<string> performer, long userId, IFormFile announcementImage)
        {

            BaseResponse response = null;

            string webinarTempFolder = _imageSettings.GetWebinarTempFolder(_appSettings.UploadFolder, userId);

            if (webinar.PaidContent == true)
            {
                webinar.PaidContentHash = GeneratePaidContentHash();
            }

            if (webinar.LiveTicket == true)
            {
                webinar.LiveTicketHash = GeneratePaidContentHash();
            }

            if (webinar.PaidContent == true && webinar.PaidContentHash.HasValue() == false)
            {
                response = new ErrorResponse("PaidContent", MessageHelper.FailedGeneratingHash, ErrorCodes.FailedGeneratingHash);
            }
            else if (webinar.LiveTicket == true && webinar.LiveTicketHash.HasValue() == false)
            {
                response = new ErrorResponse("LiveTicket", MessageHelper.FailedGeneratingHash, ErrorCodes.FailedGeneratingHash);
            }
            else
            {
                var fileHelper = new FileHelper(_logger);
                var announcementImageFileNameOnServer = await fileHelper.Upload(announcementImage, webinarTempFolder);
                if (announcementImageFileNameOnServer.HasValue())
                {

                    var resizedFile = fileHelper.ResizeImage(announcementImageFileNameOnServer, webinarTempFolder, _appSettings.FfmpegAppPath, _imageSettings.WebinarThumbnailSize);
                    if (resizedFile.HasValue())
                    {

                        var ipfsHelper = new IpfsHelper(_logger, _ipfsSettings.Host);

                        string webinarHash = await ipfsHelper.UploadFileAsync(Path.Combine(webinarTempFolder, resizedFile));
                        if (webinarHash.HasValue())
                        {

                            webinar.CreatedBy = userId;
                            webinar.Hash = webinarHash;
                            webinar.Password = KeyHelper.Generate(6, true);
                            webinar.WebinarType = WebinarType.Webinar;
                            webinar.WebinarStatusType = WebinarStatusType.Pending;
                            webinar.Active = true;
                            webinar.ApprovalEmailStatus = ApprovalEmailStatus.None;

                            if (webinar.PaidContent == false)
                            {
                                webinar.PaidContentPrice = 0;
                            }

                            if (webinar.LiveTicket == false)
                            {
                                webinar.LiveTicketPrice = 0;
                                webinar.MaxLiveTicket = 0;
                            }

                            if(webinar.LiveTicketFilPrice.HasValue == false)
                            {
                                webinar.LiveTicketFilPrice = 0;
                            }

                            if(webinar.PaidContentFilPrice.HasValue == false)
                            {
                                webinar.PaidContentFilPrice = 0;
                            }

                            webinar.LiveTicketRemaining = webinar.MaxLiveTicket;

                            List<WebinarPerformer> performers = new List<WebinarPerformer>();
                            foreach (var perf in performer)
                            {
                                performers.Add(new WebinarPerformer { Name = perf, Active = true });
                            }
                            webinar.Performers = performers;


                            var zoomApp = await _zoomAppService.GetZoomAppAsync(userId, true, true);
                            if (zoomApp != null)
                            {

                                webinar.ZoomAppId = zoomApp.Id;

                                try
                                {

                                    await _dataContext.Webinars.AddAsync(webinar);

                                    await _dataContext.SaveChangesAsync();

                                    response = new SuccessResponse(webinar.Id);

                                }
                                catch (Exception ex)
                                {
                                    _logger.Error($"While trying to save record to webinar table: {ex}");
                                    _logger.Debug($"Webinar={webinar}");
                                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                                }

                            }
                            else
                            {
                                response = new ErrorResponse("User", MessageHelper.UserDoesNotHaveRegisteredZoomApp, ErrorCodes.UserDoesNotHaveRegisteredZoomApp);
                            }

                        }
                        else
                        {
                            response = new ErrorResponse("AnnouncementImage", MessageHelper.IPFS_FailedUploadingFile, ErrorCodes.IPFS_FailedUploadingFile);
                        }


                    }
                    else
                    {
                        response = new ErrorResponse("AnnouncementImage", MessageHelper.FailedUploadingFileToServer, ErrorCodes.FailedUploadingFileToServer);
                    }


                }
                else
                {
                    response = new ErrorResponse("AnnouncementImage", MessageHelper.FailedUploadingFileToServer, ErrorCodes.FailedUploadingFileToServer);
                }
            }
            return response;
        }

        private string GeneratePaidContentHash()
        {
            string hash = null;

            try
            {

                while (true)
                {

                    hash = _appSettings.PaidContentHashPrefix + KeyHelper.Generate(_appSettings.PaidContentHashLength);

                    var count = _dataContext.Webinars.AsNoTracking()
                                         .Where(p =>
                                                    p.PaidContentHash == hash)
                                         .LongCount();

                    if (count == 0)
                    {
                        break;
                    }

                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from webinar table: {ex}");
                _logger.Debug($"WHERE PaidContentHash={hash}");
            }


            return hash;
        }

        public async Task<object> GetWebinarListAsync(WebinarFilter filter)
        {

            try
            {

                SetDefaultIfSetValuesAreNotValid(filter);

                List<Core.Domain.Webinar.Webinar> webinars = null;
                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];

                if (filter.FilterType == Helpers.Filter.Webinar.FilterType.All)
                {
                    webinars = await _dataContext.Webinars.AsNoTracking()
                                        .Include(e => e.WebinarZoom)
                                        .Include(e => e.Performers)
                                        .Include(e => e.Recordings)
                                        .Include(e => e.CreatedByUser)
                                        .Where(p =>
                                                    p.Active == true &&
                                                    (
                                                        p.WebinarStatusType == WebinarStatusType.ScheduleLive ||
                                                        p.WebinarStatusType == WebinarStatusType.LiveNow ||
                                                        p.WebinarStatusType == WebinarStatusType.LiveArchive
                                                    )
                                              )
                                        .ToListAsync();
                }
                else if (filter.FilterType == Helpers.Filter.Webinar.FilterType.LiveTicket)
                {
                    webinars = await _dataContext.Webinars.AsNoTracking()
                                        .Include(e => e.WebinarZoom)
                                        .Include(e => e.Performers)
                                        .Include(e => e.Recordings)
                                        .Include(e => e.CreatedByUser)
                                        .Where(p =>
                                                    p.Active == true &&
                                                    p.WebinarStatusType == WebinarStatusType.ScheduleLive &&
                                                    p.LiveTicket == true &&
                                                    p.LiveTicketHash != null &&
                                                    p.WebinarStart > DateTime.Now
                                              )
                                        .ToListAsync();
                }
                else
                {

                    if (user != null)
                    {
                        webinars = await _dataContext.Webinars.AsNoTracking()
                                        .Include(e => e.WebinarZoom)
                                        .Include(e => e.Performers)
                                        .Include(e => e.Recordings)
                                        .Include(e => e.CreatedByUser)
                                        .Where(p =>
                                                    p.CreatedBy == user.Id &&
                                                    p.Active == true &&
                                                    (
                                                        p.WebinarStatusType != WebinarStatusType.ForDeletion ||
                                                        p.WebinarStatusType != WebinarStatusType.Deleted
                                                    )
                                            )
                                        .ToListAsync();
                    }
                    else
                    {
                        return new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
                    }
                }

                if (webinars != null)
                {

                    var videoTypes = _commonTypeService.GetCommonTypeList(CommonTypeList.VideoType);
                    var hours = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarDurationHour);
                    var minutes = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarDurationMinute);
                    var webinarStatusTypes = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarStatusType);

                    webinars = FilterRecords(filter, webinars);

                    string strFileType = RecordingFileType.mp4.ToString();

                    var records = webinars.Select(p => new 
                    {
                        Id = p.Id,
                        LiveName = p.LiveName,
                        UserProfilePictureUrl = p.CreatedByUser.ProfilePictureHash.HasValue() == true ?
                                    string.Format(_imageSettings.ServerUrl, p.CreatedByUser.ProfilePictureHash)
                                    : "",
                        WebinarStart = p.WebinarStart.ToString("yyyy-MM-dd HH:mm"),
                        DurationHour = GetDurationHour(hours, p.DurationHour),
                        DurationMinute = GetDurationMinute(minutes, p.DurationMinute),
                        Performer = p.Performers.Select(q => new FRONT_WebinarPerformer { Name = q.Name }).ToList(),
                        Category = GetWebinarType(videoTypes, p.VideoType, false),
                        CategoryEn = GetWebinarType(videoTypes, p.VideoType, true),
                        TopPageAnnouncement = p.TopPageAnnouncement,
                        YoutubeLive = p.YoutubeLive,
                        LiveTicket = p.LiveTicket,
                        LiveTicketHash = p.LiveTicketHash,
                        LiveTicketPrice = string.Format("{0}{1}", _paypalSettings.Currency, p.LiveTicketPrice?.ToString("N", CultureInfo.InvariantCulture)),
                        LiveTicketFilPrice = p.LiveTicketFilPrice,
                        MaxLiveTicket = p.MaxLiveTicket,
                        TicketsSold = p.LiveTicket == true ? p.LiveTicketRemaining == 0 : false,
                        Agenda = p.Agenda,
                        ZoomUrl = p.LiveTicket == true ? "" : p.WebinarZoom?.Zoom_join_url,
                        ZoomStartUrl = filter.FilterType == Helpers.Filter.Webinar.FilterType.List ? p.WebinarZoom?.Zoom_start_url : "",
                        Status = GetWebinarStatusType(webinarStatusTypes, p.WebinarStatusType),
                        Thumbnail = string.Format(_imageSettings.ServerUrl, p.Hash),
                        YoutubeUrl = p.YoutubeUrl,
                        ReplayUrl = p.Recordings
                                        .Where(q =>
                                                    (q.RecordingStatusType == RecordingStatusType.Uploaded || q.RecordingStatusType == RecordingStatusType.Imported) &&
                                                    q.FileType.ToLower() == strFileType)
                                        .Select(q => new FRONT_WebinarReplayUrl
                                        {
                                            Url = string.Format(_videoSettings.ServerUrl, q.Hash)
                                        }).ToList(),
                        Purchased = CheckIfUserAlreadyPurchasedWebinar(user?.Id, p.Id),
                        Subscribed = CheckIfUserAlreadySubscribedToArtist(user?.Id, p.CreatedBy)
                    });

                    records = records.Where(p => p.Purchased == false && p.TicketsSold == false);

                    RecordListResponse response = null;

                    response = new RecordListResponse(records.Count(), filter.RecordPerPage);

                    if (response.Total > 0)
                    {
                        records = records.Skip((filter.CurrentPage - 1) * filter.RecordPerPage)
                                .Take(filter.RecordPerPage);
                    }

                    response.Filter = filter;
                    response.Data.AddRange(records);

                    return response;

                }


            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                _logger.Debug($"WHERE");
            }

            return null;

        }

        private bool CheckIfUserAlreadySubscribedToArtist(long? userId, long artistId)
        {
            if (userId.HasValue == false)
            {
                return false;
            }

            try
            {

                var purchasedSubscription = _dataContext.Purchases.AsNoTracking()
                                    .Include(e => e.SubscriptionSettings)
                                    .Where(p =>
                                                p.UserId == userId &&
                                                p.PurchaseType == PurchaseType.Subscription &&
                                                (
                                                    p.PurchaseStatusType == PurchaseStatusType.WaitingForPayment ||
                                                    p.PurchaseStatusType == PurchaseStatusType.Active
                                                ) &&
                                                p.Active == true &&
                                                p.SubscriptionSettings.UserId == artistId)
                                    .FirstOrDefault();

                if (purchasedSubscription != null)
                {
                    return true;
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={userId} AND PurchaseType={(int)PurchaseType.Subscription} AND " +
                    $"PurchaseStatusType={(int)PurchaseStatusType.WaitingForPayment} OR PurchaseStatusType={(int)PurchaseStatusType.Active}" +
                    $"AND Active=1 AND subscription_settings.UserId={artistId} ");
            }

            return false;

        }

        private bool CheckIfUserAlreadyPurchasedWebinar(long? userId, long webinarId)
        {
            if (userId.HasValue == false)
            {
                return false;
            }

            try
            {

                return _dataContext.Purchases.AsNoTracking()
                        .Where(p =>
                                    p.UserId == userId &&
                                    p.WebinarId == webinarId &&
                                    p.PurchaseType == PurchaseType.LiveTicket &&
                                    (
                                        p.PurchaseStatusType == PurchaseStatusType.Captured ||
                                        p.PurchaseStatusType == PurchaseStatusType.Active
                                    )
                            )
                        .Count() > 0;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE UserId={userId} AND WebinarId={webinarId} AND PurchaseType={(int)PurchaseType.LiveTicket} AND " +
                    $"PurchaseStatusType={(int)PurchaseStatusType.Captured} OR PurchaseStatusType={(int)PurchaseStatusType.Active}");

                return false;
            }
        }

        public async Task<object> GetWebinarCalendarListAsync(WebinarCalendarFilter filter)
        {

            #region Year & Month validation

            if (filter.Year == 0)
            {
                return new ErrorResponse("Year", MessageHelper.Invalid, ErrorCodes.Invalid);
            }
            else if (filter.Year.HasValue == false)
            {
                return new ErrorResponse("Year", MessageHelper.Required, ErrorCodes.Required);
            }
            else if (filter.Month <= 0 || filter.Month > 12)
            {
                return new ErrorResponse("Month", MessageHelper.Invalid, ErrorCodes.Invalid);
            }
            else if (filter.Month.HasValue == false)
            {
                return new ErrorResponse("Month", MessageHelper.Required, ErrorCodes.Required);
            }

            #endregion

            try
            {

                var lastDayOfTheMonth = DateTime.DaysInMonth((int)filter.Year, (int)filter.Month);

                var dateStart = new DateTime((int)filter.Year, (int)filter.Month, 1, 0, 0, 0);
                var dateEnd = new DateTime((int)filter.Year, (int)filter.Month, lastDayOfTheMonth, 23, 59, 59);

                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
 
                var webinars = await _dataContext.Webinars.AsNoTracking()
                                        .Include(e => e.CreatedByUser)
                                        .OrderBy(p => p.WebinarStart)
                                        .Where(p =>
                                                    p.Active == true &&
                                                    p.WebinarStatusType == WebinarStatusType.ScheduleLive &&
                                                    p.LiveTicket == true &&
                                                    p.LiveTicketHash != null
                                        )
                                        .ToListAsync();

                webinars = webinars.Where(p =>
                                                Convert.ToDateTime(p.WebinarStart.ToString("yyyy-MM-dd HH:mm")) >= Convert.ToDateTime(dateStart.ToString("yyyy-MM-dd HH:mm")) &&
                                                Convert.ToDateTime(p.WebinarStart.ToString("yyyy-MM-dd HH:mm")) <= Convert.ToDateTime(dateEnd.ToString("yyyy-MM-dd HH:mm")))
                                    .ToList();


                //  Check if keyword is specified
                if (filter.Keyword.HasValue())
                {
                    //  Search webinars by keyword
                    webinars = webinars.Where(p =>
                                                    p.LiveName.ToLower().Contains(filter.Keyword.ToLower()) ||
                                                    p.CreatedByUser.Username.ToLower().Contains(filter.Keyword.ToLower()))
                                    .ToList();
                }

                if (filter.VideoType != null)
                {
                    webinars = webinars.Where(p =>
                                                p.VideoType == filter.VideoType)
                                    .ToList();
                }

                var records = webinars.Select(p => new
                {
                    p.Id,
                    p.LiveName,
                    Date = p.WebinarStart.ToString("yyyy-MM-dd"),
                    Time = p.WebinarStart.ToString("HH:mm"),
                    Purchased = CheckIfUserAlreadyPurchasedWebinar(user?.Id, p.Id),
                    Subscribed = CheckIfUserAlreadySubscribedToArtist(user?.Id, p.CreatedBy)
                });

                records = records.Where(p => p.Purchased == false);

                return new SuccessResponse(records);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                _logger.Debug($"WHERE");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public async Task<List<Core.Domain.Webinar.Webinar>> GetWebinarListAsync(ApprovalEmailStatus approvalEmailStatus)
        {
            List<Core.Domain.Webinar.Webinar> records = null;

            try
            {
                records = await _dataContext.Webinars.AsNoTracking()
                    .Include(e => e.CreatedByUser)
                    .Include(e => e.WebinarZoom)
                    .Where(p =>
                                p.ApprovalEmailStatus == approvalEmailStatus)
                    .ToListAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from webinar table: {ex}");
                _logger.Debug($"WHERE ApprovalEmailStatus={approvalEmailStatus}");
            }

            return records;
        }

        public async Task<List<Core.Domain.Webinar.Webinar>> GetWebinarPastWebinarListAsync(WebinarStatusType[] webinarStatuses, bool asNoTracking = false)
        {

            List<Core.Domain.Webinar.Webinar> records = null;

            try
            {

                var dt = Convert.ToDateTime(DateTime.Now.ToString("yyyy-MM-dd HH:mm"));

                if (asNoTracking == true)
                {
                    records = await _dataContext.Webinars.AsNoTracking()
                        .Where(p =>
                                    webinarStatuses.Contains(p.WebinarStatusType) &&
                                    p.WebinarStart <= dt)
                        .ToListAsync();
                }
                else
                {
                    records = await _dataContext.Webinars
                        .Where(p =>
                                    webinarStatuses.Contains(p.WebinarStatusType) &&
                                    p.WebinarStart <= dt)
                        .ToListAsync();
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from webinar table: {ex}");
                _logger.Debug($"WHERE WebinarStatusType IN ({webinarStatuses})");
            }

            return records;

        }

        private static string GetDurationMinute(List<Core.Domain.CommonType.CommonType> minutes, int? durationMinute)
        {
            string response = "";

            if (minutes != null && minutes.LongCount() > 0)
            {

                var type = minutes.Where(p => p.Value == (int)durationMinute).SingleOrDefault();
                if (type != null)
                {
                    response = type.Name;
                }

            }

            return response;
        }

        private static string GetDurationHour(List<Core.Domain.CommonType.CommonType> hours, int? durationHour)
        {
            string response = "";

            if (hours != null && hours.LongCount() > 0)
            {

                var type = hours.Where(p => p.Value == (int)durationHour).SingleOrDefault();
                if (type != null)
                {
                    response = type.Name;
                }

            }

            return response;
        }

        private void SetDefaultIfSetValuesAreNotValid(FilterHelper filter)
        {
            if (filter.RecordPerPage <= 0)
            {
                filter.RecordPerPage = _appSettings.RecordPerPage;
            }
            else if (filter.RecordPerPage > _appSettings.MaxRecordPerPage)
            {
                filter.RecordPerPage = _appSettings.MaxRecordPerPage;
            }

            if (filter.CurrentPage < 1)
            {
                filter.CurrentPage = 1;
            }
        }


        private List<Core.Domain.Webinar.Webinar> FilterRecords(WebinarFilter filter, List<Core.Domain.Webinar.Webinar> webinars)
        {
            //  Check if keyword is specified
            if (filter.Keyword.HasValue())
            {

                if (filter.FilterType == Helpers.Filter.Webinar.FilterType.LiveTicket)
                {
                    //  Search webinars by keyword
                    webinars = webinars.Where(p =>
                                                    p.LiveName.ToLower().Contains(filter.Keyword.ToLower()) ||
                                                    p.CreatedByUser.Username.ToLower().Contains(filter.Keyword.ToLower()))
                                    .ToList();
                }
                else
                {
                    webinars = webinars.Where(p =>
                                                (p.LiveName.ToLower() + " " + p.Agenda.ToLower()).Contains(filter.Keyword.ToLower()))
                                        .ToList();
                }
            }

            if (filter.VideoType != null)
            {

                webinars = webinars.Where(p =>
                                            p.VideoType == filter.VideoType)
                                .ToList();

            }

            if (filter.WebinarStatus != null && filter.WebinarStatus.Count > 0)
            {

                var statuses = filter.WebinarStatus.Where(p => p != null).ToList();

                if (statuses != null && statuses.Count > 0)
                {
                    webinars = webinars.Where(p =>
                                                statuses.Contains(p.WebinarStatusType))
                                    .ToList();
                }
            }

            // Check if datefrom is specified
            if (filter.DateFrom.HasValue)
            {

                webinars = webinars.Where(p =>
                                            Convert.ToDateTime(p.WebinarStart.ToString("yyyy-MM-dd HH:mm")) >= Convert.ToDateTime(filter.DateFrom?.ToString("yyyy-MM-dd HH:mm")))
                                    .ToList();

            }

            // Check if dateto is specified
            if (filter.DateTo.HasValue)
            {

                webinars = webinars.Where(p =>
                                            Convert.ToDateTime(p.WebinarStart.ToString("yyyy-MM-dd HH:mm")) <= Convert.ToDateTime(filter.DateTo?.ToString("yyyy-MM-dd HH:mm")))
                                    .ToList();

            }

            webinars = OrderRecords(filter, webinars);

            return webinars;

        }

        private List<Core.Domain.Webinar.Webinar> OrderRecords(WebinarFilter filter, List<Core.Domain.Webinar.Webinar> webinars)
        {

            if (filter.OrderBy != null && filter.OrderType != null)
            {
                if (filter.OrderType == Helpers.Filter.OrderType.Ascending)
                {
                    if (filter.OrderBy == WebinarOrderByType.DateCreated)
                    {
                        webinars = webinars.OrderBy(p => p.DateCreated).ToList();
                    }
                    else if (filter.OrderBy == WebinarOrderByType.WebinarStart)
                    {
                        webinars = webinars.OrderBy(p => p.WebinarStart).ToList();
                    }
                }
                else
                {
                    if (filter.OrderBy == WebinarOrderByType.DateCreated)
                    {
                        webinars = webinars.OrderByDescending(p => p.DateCreated).ToList();
                    }
                    else if (filter.OrderBy == WebinarOrderByType.WebinarStart)
                    {
                        webinars = webinars.OrderByDescending(p => p.WebinarStart).ToList();
                    }
                }
            }
            else if(filter.OrderType != null && filter.OrderBy == null)
            {
                if(filter.OrderType == Helpers.Filter.OrderType.Ascending)
                {
                    webinars = webinars.OrderBy(p => p.Id).ToList();
                }
                else
                {
                    webinars = webinars.OrderByDescending(p => p.Id).ToList();
                }
            }

            return webinars;

        }

        public static string GetWebinarType(List<Core.Domain.CommonType.CommonType> videoTypes, VideoType? videoType, bool englishName)
        {
            string response = "";

            if (videoTypes != null && videoTypes.LongCount() > 0)
            {

                var vidType = videoTypes.Where(p => p.Value == (int)videoType).SingleOrDefault();
                if (vidType != null)
                {
                    response = englishName == false ? vidType.Name : vidType.NameEn;
                }

            }

            return response;
        }

        private static string GetWebinarStatusType(List<Core.Domain.CommonType.CommonType> webinarStatusTypes, WebinarStatusType webinarStatusType)
        {
            string response = "";

            if (webinarStatusTypes != null && webinarStatusTypes.LongCount() > 0)
            {

                var vidType = webinarStatusTypes.Where(p => p.Value == (int)webinarStatusType).SingleOrDefault();
                if (vidType != null)
                {
                    response = vidType.Name;
                }

            }

            return response;

        }

        public async Task<object> GetWebinarAsync(long id)
        {

            try
            {

                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];

                string strFileType = RecordingFileType.mp4.ToString();

                var videoTypes = _commonTypeService.GetCommonTypeList(CommonTypeList.VideoType);

                var webinarStatusTypes = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarStatusType);
                var hours = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarDurationHour);
                var minutes = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarDurationMinute);

                var webinar = await _dataContext.Webinars.AsNoTracking()
                                            .Include(e => e.CreatedByUser)
                                            .Include(e => e.WebinarZoom)
                                            .Include(e => e.Performers)
                                            .Include(e => e.Recordings)
                                            .Where(p => 
                                                        p.Id == id &&
                                                        p.Active == true &&
                                                        (
                                                            p.WebinarStatusType == WebinarStatusType.Pending ||
                                                            p.WebinarStatusType == WebinarStatusType.ScheduleLive ||
                                                            p.WebinarStatusType == WebinarStatusType.LiveNow ||
                                                            p.WebinarStatusType == WebinarStatusType.LiveArchive
                                                        )
                                                )
                                            .SingleOrDefaultAsync();

                if(webinar != null)
                {

                    string zoomStartUrl = "";
                    if(user != null)
                    {
                        if(webinar.CreatedBy == user.Id)
                        {
                            zoomStartUrl = webinar.WebinarZoom?.Zoom_start_url;
                        }
                    }

                    var record = new
                    {
                        webinar.Id,
                        webinar.CreatedByUser.Username,
                        UserProfilePictureUrl = webinar.CreatedByUser.ProfilePictureHash.HasValue() == true ?
                                    string.Format(_imageSettings.ServerUrl, webinar.CreatedByUser.ProfilePictureHash)
                                    : "",
                        webinar.LiveName,
                        WebinarStart = webinar.WebinarStart.ToString("yyyy-MM-dd HH:mm"),
                        DurationHour = GetDurationHour(hours, webinar.DurationHour),
                        DurationMinute = GetDurationMinute(minutes, webinar.DurationMinute),
                        Performer = webinar.Performers.Select(q => new { q.Name }).ToList(),
                        Category = GetWebinarType(videoTypes, webinar.VideoType, false),
                        CategoryEn = GetWebinarType(videoTypes, webinar.VideoType, true),
                        webinar.TopPageAnnouncement,
                        webinar.YoutubeLive,
                        webinar.LiveTicket,
                        webinar.LiveTicketHash,
                        webinar.LiveTicketPrice,
                        webinar.LiveTicketFilPrice,
                        webinar.PaidContent,
                        webinar.PaidContentPrice,
                        webinar.PaidContentFilPrice,
                        webinar.MaxLiveTicket,
                        webinar.Agenda,
                        ZoomUrl = webinar.LiveTicket == true ? GetZoomUrl(_logger, _contextAccessor, _dataContext, user, webinar.Id, webinar.CreatedBy, webinar.WebinarZoom?.Zoom_join_url) : webinar.WebinarZoom?.Zoom_join_url,
                        ZoomStartUrl = zoomStartUrl,
                        Status = GetWebinarStatusType(webinarStatusTypes, webinar.WebinarStatusType),
                        Thumbnail = string.Format(_imageSettings.ServerUrl, webinar.Hash),
                        webinar.YoutubeUrl,
                        ReplayUrl = webinar.Recordings
                                            .Where(q =>
                                                        (q.RecordingStatusType == RecordingStatusType.Uploaded || q.RecordingStatusType == RecordingStatusType.Imported) &&
                                                        q.FileType.ToLower() == strFileType)
                                            .Select(q => new
                                            {
                                                Url = string.Format(_videoSettings.ServerUrl, q.Hash)
                                            }).ToList(),
                        TicketsSold = webinar.LiveTicket == true ? webinar.LiveTicketRemaining == 0 : false,
                        Subscribed = CheckIfUserAlreadySubscribedToArtist(user?.Id, webinar.CreatedBy)
                    };

                    return new SuccessResponse(record);

                }

                return new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                _logger.Debug($"Id={id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            } 

        }

        private static string GetZoomUrl(IWeRaveYouLog logger, IHttpContextAccessor contextAccessor, DataContext dataContext, Core.Domain.User.User user, long webinarId, long userIdWebinarOwner, string zoomJoinUrl)
        {

            string url = "";

            if(user != null)
            {

                //  Check if logged in user is the webinar owner
                if (user.Id == userIdWebinarOwner)
                {
                    url = zoomJoinUrl;
                }
                else
                {

                    try
                    {
                        var record = dataContext.Purchases.AsNoTracking()
                                            .Where(p =>
                                                        p.UserId == user.Id &&
                                                        p.WebinarId == webinarId &&
                                                        p.PurchaseType == PurchaseType.LiveTicket &&
                                                        p.PurchaseStatusType == PurchaseStatusType.Active &&
                                                        p.Active == true)
                                            .SingleOrDefault();

                        if(record != null)
                        {
                            url = zoomJoinUrl;
                        }

                    }
                    catch (Exception ex)
                    {
                        logger.Error($"While trying to get record from purchase table: {ex}");
                        logger.Debug($"WHERE UserId={user.Id} AND WebinarId={webinarId} AND PurchaseType={PurchaseType.LiveTicket} AND PurchaseStatusType={PurchaseStatusType.Active} AND Active=1");
                    }

                }

            }

            return url;

        }

        public async Task<int> GetWebinarCountAsync(long id, long zoomAppId)
        {
            int count = 0;
            try
            {

                count = await _dataContext.Webinars.AsNoTracking()
                            .Where(p =>
                                        p.Id == id &&
                                        p.ZoomAppId == zoomAppId)
                            .CountAsync();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from webinar table: {ex}");
                _logger.Debug($"WHERE Id={id} AND ZoomAppId ={zoomAppId}");
            }

            return count;
        }


        public async Task<BaseResponse> UpdateWebinarAsync(long id, string youtubeUrl)
        {

            BaseResponse response = null;

            try
            {

                var record = await _dataContext.Webinars
                                    .Where(p =>
                                            p.Id == id)
                                    .SingleOrDefaultAsync();

                if(record != null)
                {

                    try
                    {

                        record.YoutubeUrl = youtubeUrl;

                        _dataContext.Webinars.Update(record);
                        await _dataContext.SaveChangesAsync();

                        response = new SuccessResponse();

                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update webinar record: {ex1}");
                        _logger.Debug($"YoutubeUrl={youtubeUrl} WHERE Id={id}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }
                else
                {
                    response = new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            return response;

        }

        public async Task<BaseResponse> UpdateWebinarAsync(long id, bool active)
        {

            BaseResponse response = null;

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {

                try
                {

                    var record = await _dataContext.Webinars
                                        .Include(e => e.WebinarZoom)
                                        .Where(p =>
                                                p.Id == id &&
                                                p.CreatedBy == user.Id)
                                        .SingleOrDefaultAsync();

                    if (record != null)
                    {

                        if (record.Active == true && record.WebinarStatusType == WebinarStatusType.ScheduleLive)
                        {

                            if (_zoomSettings != null)
                            {
                                var zoomApp = await _zoomAppService.GetZoomAppAsync(user.Id, true, true);
                                if (zoomApp != null)
                                {
                                    var zoomApiHelper = new ZoomApiHelper(_logger, zoomApp, _zoomSettings.DeleteWebinarTokenExpiration);
                                    await zoomApiHelper.DeleteWebinarAsync(_zoomSettings.GetDeleteWebinarUrl(record.WebinarZoom.Zoom_id));
                                    try
                                    {

                                        record.Active = active;
                                        record.WebinarStatusType = WebinarStatusType.Deleted;

                                        _dataContext.Webinars.Update(record);
                                        await _dataContext.SaveChangesAsync();

                                        response = new SuccessResponse();

                                    }
                                    catch (Exception ex1)
                                    {
                                        _logger.Error($"While trying to update webinar record: {ex1}");
                                        _logger.Debug($"Active={active},WebinarStatusType={WebinarStatusType.Deleted} WHERE Id={id} AND CreatedBy={user.Id}");
                                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                                    }
                                }
                                else
                                {
                                    response = new ErrorResponse("User", MessageHelper.UserDoesNotHaveRegisteredZoomApp, ErrorCodes.UserDoesNotHaveRegisteredZoomApp);
                                }
                            }
                            else
                            {
                                response = new ErrorResponse("ZoomSettings", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                            }
                        }
                        else
                        {
                            response = new ErrorResponse("Id", MessageHelper.DeleteNotAllowed, ErrorCodes.CannotDeleteWebinar);
                        }
                    }
                    else
                    {
                        response = new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                    }

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from webinar table: {ex}");
                    _logger.Debug($"WHERE Id={id} AND CreatedBy={user.Id}");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }

            }
            else
            {
                response = new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
            }

            return response;

        }

        public async Task<BaseResponse> UpdateWebinarAsync(Core.Domain.Webinar.Webinar webinar)
        {

            try
            {
                _dataContext.Webinars.Update(webinar);
                await _dataContext.SaveChangesAsync();
                return new SuccessResponse();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update webinar record: {ex}");
                _logger.Debug($"WHERE Id={webinar.Id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public async Task<BaseResponse> UpdateWebinarAsync(string id, WebinarStatusType webinarStatus)
        {

            BaseResponse response = null;

            try
            {

                long _id = Convert.ToInt64(id);

                var record = await _dataContext.Webinars
                                    .Include(e => e.WebinarZoom)
                                    .Where(p =>
                                            p.WebinarZoom.Zoom_id == _id)
                                    .SingleOrDefaultAsync();

                if (record != null)
                {

                    try
                    {

                        record.WebinarStatusType = webinarStatus;

                        _dataContext.Webinars.Update(record);
                        await _dataContext.SaveChangesAsync();

                        response = new SuccessResponse();

                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update webinar record: {ex1}");
                        _logger.Debug($"WebinarStatusType={webinarStatus} WHERE Zoom_id={_id}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }
                else
                {
                    response = new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                _logger.Debug($"WHERE Zoom_id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            return response;

        }

        public async Task<BaseResponse> UpdateWebinarAsync(long id, ApprovalEmailStatus approvalEmailStatus)
        {

            BaseResponse response = null;

            try
            {

                var record = await _dataContext.Webinars
                                    .Where(p =>
                                            p.Id == id)
                                    .SingleOrDefaultAsync();

                if (record != null)
                {

                    try
                    {

                        record.ApprovalEmailStatus = approvalEmailStatus;

                        _dataContext.Webinars.Update(record);
                        await _dataContext.SaveChangesAsync();

                        response = new SuccessResponse();

                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update webinar record: {ex1}");
                        _logger.Debug($"ApprovalEmailStatus={approvalEmailStatus} WHERE Id={id}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }
                else
                {
                    response = new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            return response;

        }


        public async Task<Core.Domain.Webinar.Webinar> GetWebinarAsync(long id, bool idIsEqualToZoom_id)
        {

            Core.Domain.Webinar.Webinar record = null;

            try
            {

                if(idIsEqualToZoom_id == true)
                {
                    record = await _dataContext.Webinars.AsNoTracking()
                                        .Include(e => e.WebinarZoom)
                                        .Where(p =>
                                                    p.WebinarZoom.Zoom_id == id)
                                        .SingleOrDefaultAsync();
                }
                else
                {
                    record = await _dataContext.Webinars.AsNoTracking()
                                        .Where(p =>
                                                    p.Id == id)
                                        .SingleOrDefaultAsync();
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                if (idIsEqualToZoom_id == true)
                {
                    _logger.Debug($"WHERE Zoom_id={id}");
                }
                else
                {
                    _logger.Debug($"WHERE Id={id}");
                }
            }

            return record;

        }

        public async Task<Core.Domain.Webinar.Webinar> GetWebinarAsync(long id, string uuid)
        {

            Core.Domain.Webinar.Webinar record = null;

            try
            {

                var webinarZoom = await _dataContext.WebinarZooms.AsNoTracking()
                                            .Include(e => e.Webinar)
                                                .ThenInclude(e => e.Recordings)
                                            .Where(p =>
                                                        p.Zoom_id == id &&
                                                        p.Zoom_uuid == uuid)
                                            .SingleOrDefaultAsync();

                if(webinarZoom != null)
                {
                    record = webinarZoom.Webinar;
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar_zoom table: {ex}");
                _logger.Debug($"WHERE webinar_zoom.Zoom_id={id} AND webinar_zoom.Zoom_uuid={uuid}");
            }

            return record;

        }

        public int GetWebinarCount(long id, DateTime? webinarStart, WebinarIdFilterType idFilterType)
        {
            int count = 0;
            try
            {


                if(idFilterType == WebinarIdFilterType.ZoomAppId)
                {
                    count = _dataContext.Webinars.AsNoTracking()
                                .Where(p =>
                                            p.ZoomAppId == id &&
                                            p.WebinarStart == webinarStart)
                                .Count();
                }
                else if(idFilterType == WebinarIdFilterType.CreatedBy)
                {
                    count = _dataContext.Webinars.AsNoTracking()
                                .Where(p =>
                                            p.CreatedBy == id &&
                                            p.WebinarStart == webinarStart)
                                .Count();
                }
                else
                {
                    count = _dataContext.Webinars.AsNoTracking()
                                .Where(p =>
                                            p.Id == id &&
                                            p.WebinarStart == webinarStart)
                                .Count();
                }

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from webinar table: {ex}");

                if (idFilterType == WebinarIdFilterType.ZoomAppId)
                {
                    _logger.Debug($"WHERE ZoomAppId={id} AND WebinarStart ={webinarStart}");
                }
                else if (idFilterType == WebinarIdFilterType.CreatedBy)
                {
                    _logger.Debug($"WHERE CreatedBy={id} AND WebinarStart ={webinarStart}");
                }
                else
                {
                    _logger.Debug($"WHERE Id={id} AND WebinarStart ={webinarStart}");
                }

            }

            return count;
        }

        public long? GetWebinarCount(string liveTicketHash, WebinarStatusType webinarStatus)
        {

            long? count = null;
            try
            {

                count = _dataContext.Webinars.AsNoTracking()
                            .Where(p =>
                                        p.LiveTicketHash == liveTicketHash &&
                                        p.LiveTicket == true &&
                                        p.WebinarStatusType == webinarStatus)
                            .LongCount();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from webinar table: {ex}");
                _logger.Debug($"WHERE LiveTicketHash={liveTicketHash} AND LiveTicket=1 AND WebinarStatusType={webinarStatus}");
            }

            return count;

        }

        public long? GetWebinarCount(long createdBy, string liveTicketHash)
        {

            long? count = null;
            try
            {

                count = _dataContext.Webinars.AsNoTracking()
                            .Where(p =>
                                        p.CreatedBy == createdBy &&
                                        p.LiveTicketHash == liveTicketHash &&
                                        p.LiveTicket == true)
                            .LongCount();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from webinar table: {ex}");
                _logger.Debug($"WHERE CreatedBy={createdBy} LiveTicketHash={liveTicketHash} AND LiveTicket=1");
            }

            return count;

        }

        public long? GetWebinarCount(string liveTicketHash, bool withAvailableLiveTicket)
        {
            long? count = null;
            try
            {

                if (withAvailableLiveTicket)
                {
                    count = _dataContext.Webinars.AsNoTracking()
                                .Where(p =>
                                            p.LiveTicketHash == liveTicketHash &&
                                            p.LiveTicket == true &&
                                            p.LiveTicketRemaining > 0)
                                .LongCount();
                }
                else
                {
                    count = _dataContext.Webinars.AsNoTracking()
                                .Where(p =>
                                            p.LiveTicketHash == liveTicketHash &&
                                            p.LiveTicket == true)
                                .LongCount();
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from webinar table: {ex}");
                if(withAvailableLiveTicket)
                {
                    _logger.Debug($"WHERE LiveTicketHash={liveTicketHash} AND LiveTicket=1 AND LiveTicketRemaining >= MaxLiveTicket");
                }    
                else
                {
                    _logger.Debug($"WHERE LiveTicketHash={liveTicketHash} AND LiveTicket=1");
                }
            }

            return count;

        }

        public Core.Domain.Webinar.Webinar GetWebinar(string liveTicketHash, bool asNoTracking = true)
        {

            Core.Domain.Webinar.Webinar record = null;

            try
            {

                if (asNoTracking)
                {
                    record = _dataContext.Webinars.AsNoTracking()
                                                .Include(e => e.WebinarZoom)
                                                .Include(e => e.CreatedByUser)
                                                    .ThenInclude(e => e.SubscriptionSettings)
                                                .Include(e => e.Performers)
                                                .Where(p =>
                                                            p.LiveTicketHash == liveTicketHash &&
                                                            p.LiveTicket == true)
                                                .SingleOrDefault();
                }
                else
                {
                    record = _dataContext.Webinars
                            .Include(e => e.WebinarZoom)
                            .Include(e => e.CreatedByUser)
                                .ThenInclude(e => e.SubscriptionSettings)
                            .Include(e => e.Performers)
                            .Where(p =>
                                        p.LiveTicketHash == liveTicketHash &&
                                        p.LiveTicket == true)
                            .SingleOrDefault();
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                _logger.Debug($"WHERE LiveTicketHash={liveTicketHash} AND LiveTicket=1");
            }

            return record;

        }

        public async Task<object> GetListAsync(ArtistWebinarFilter filter)
        {

            RecordListResponse response = null;

            try
            {

                if (filter.ArtistName.HasValue() == false)
                {
                    return new ErrorResponse("ArtistName", MessageHelper.Required, ErrorCodes.Required);
                }

                var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
                if (user == null)
                {
                    return new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
                }

                SetDefaultIfSetValuesAreNotValid(filter);

                var webinars = await _dataContext.Webinars.AsNoTracking()
                                    .Include(e => e.CreatedByUser)
                                    .Include(e => e.WebinarZoom)
                                    .Include(e => e.Performers)
                                    .Include(e => e.Recordings)
                                    .Where(p =>
                                                p.CreatedByUser.Username.Equals(filter.ArtistName, StringComparison.OrdinalIgnoreCase) &&
                                                p.CreatedByUser.UserType == Core.Domain.User.Enums.UserType.Creator &&
                                                p.Active == true &&
                                                (
                                                    p.WebinarStatusType == WebinarStatusType.ScheduleLive ||
                                                    p.WebinarStatusType == WebinarStatusType.LiveNow ||
                                                    p.WebinarStatusType == WebinarStatusType.LiveArchive
                                                )
                                          )
                                    .ToListAsync();


                if (webinars.Count > 0)
                {

                    var videoTypes = _commonTypeService.GetCommonTypeList(CommonTypeList.VideoType);
                    var hours = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarDurationHour);
                    var minutes = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarDurationMinute);
                    var webinarStatusTypes = _commonTypeService.GetCommonTypeList(CommonTypeList.WebinarStatusType);

                    string strFileType = RecordingFileType.mp4.ToString();

                    var records = webinars.Select(p => new FRONT_RecommendedWebinarList
                    {
                        Id = p.Id,
                        LiveName = p.LiveName,
                        UserProfilePictureUrl = p.CreatedByUser.ProfilePictureHash.HasValue() == true ?
                                    string.Format(_imageSettings.ServerUrl, p.CreatedByUser.ProfilePictureHash)
                                    : "",
                        WebinarStart = p.WebinarStart.ToString("yyyy-MM-dd HH:mm"),
                        DurationHour = GetDurationHour(hours, p.DurationHour),
                        DurationMinute = GetDurationMinute(minutes, p.DurationMinute),
                        Performer = p.Performers.Select(q => new FRONT_WebinarPerformer { Name = q.Name }).ToList(),
                        Category = GetWebinarType(videoTypes, p.VideoType, false),
                        CategoryEn = GetWebinarType(videoTypes, p.VideoType, true),
                        TopPageAnnouncement = p.TopPageAnnouncement,
                        YoutubeLive = p.YoutubeLive,
                        LiveTicket = p.LiveTicket,
                        LiveTicketHash = p.LiveTicketHash,
                        LiveTicketPrice = string.Format("{0}{1}", _paypalSettings.Currency, p.LiveTicketPrice?.ToString("N", CultureInfo.InvariantCulture)),
                        LiveTicketFilPrice = p.LiveTicketFilPrice,
                        MaxLiveTicket = p.MaxLiveTicket,
                        TicketsSold = p.LiveTicket == true ? p.LiveTicketRemaining == 0 : false,
                        Agenda = p.Agenda,
                        ZoomUrl = p.LiveTicket == true ? "" : p.WebinarZoom?.Zoom_join_url,
                        ZoomStartUrl =  "",
                        Status = GetWebinarStatusType(webinarStatusTypes, p.WebinarStatusType),
                        Thumbnail = string.Format(_imageSettings.ServerUrl, p.Hash),
                        YoutubeUrl = p.YoutubeUrl,
                        ReplayUrl = p.Recordings
                                        .Where(q =>
                                                    (q.RecordingStatusType == RecordingStatusType.Uploaded || q.RecordingStatusType == RecordingStatusType.Imported) &&
                                                    q.FileType.ToLower() == strFileType)
                                        .Select(q => new FRONT_WebinarReplayUrl
                                        {
                                            Url = string.Format(_videoSettings.ServerUrl, q.Hash)
                                        }).ToList(),
                        Purchased = CheckIfUserAlreadyPurchasedWebinar(user?.Id, p.Id),
                        Subscribed = CheckIfUserAlreadySubscribedToArtist(user?.Id, p.CreatedBy)
                    });

                    records = records.Where(p => p.Purchased == false);


                    response = new RecordListResponse(records.Count(), filter.RecordPerPage);

                    if (response.Total > 0)
                    {
                        records = records.Skip((filter.CurrentPage - 1) * filter.RecordPerPage)
                                .Take(filter.RecordPerPage);
                    }

                    response.Filter = filter;
                    response.Data.AddRange(records);

                    return response;

                }


            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar table: {ex}");
                _logger.Debug($"WHERE");
            }

            response = new RecordListResponse(0, filter.RecordPerPage);
            response.Filter = filter;
            return response;

        }


    }

    public class FRONT_RecommendedWebinarList
    {
        public long Id { get; internal set; }
        public string LiveName { get; internal set; }
        public string UserProfilePictureUrl { get; internal set; }
        public string WebinarStart { get; internal set; }
        public string DurationHour { get; internal set; }
        public string DurationMinute { get; internal set; }
        public string Category { get; internal set; }
        public string CategoryEn { get; internal set; }
        public bool TopPageAnnouncement { get; internal set; }
        public bool YoutubeLive { get; internal set; }
        public bool LiveTicket { get; internal set; }
        public string LiveTicketHash { get; internal set; }
        public string LiveTicketPrice { get; internal set; }
        public double? LiveTicketFilPrice { get; internal set; }
        public int? MaxLiveTicket { get; internal set; }
        public bool TicketsSold { get; internal set; }
        public string Agenda { get; internal set; }
        public string ZoomUrl { get; internal set; }
        public string ZoomStartUrl { get; internal set; }
        public string Status { get; internal set; }
        public string Thumbnail { get; internal set; }
        public string YoutubeUrl { get; internal set; }
        public List<FRONT_WebinarPerformer> Performer { get; set; }
        public List<FRONT_WebinarReplayUrl> ReplayUrl { get; set; }

        [IgnoreDataMember]
        public bool Purchased { get; internal set; }
        public bool Subscribed { get; internal set; }
    }

    public class FRONT_WebinarPerformer
    {
        public string Name { get; set; }
    }

    public class FRONT_WebinarReplayUrl
    {
        public string Url { get; set; }
    }




}
