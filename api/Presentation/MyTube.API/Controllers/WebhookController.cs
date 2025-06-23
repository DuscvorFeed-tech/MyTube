using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using MyTube.Services.Helpers.Logging;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using MyTube.API.Models.Webhook;
using MyTube.Services.Helpers.Settings;
using Microsoft.Extensions.Options;
using MyTube.Services.Zoom;
using MyTube.Core.Domain.Zoom;
using MyTube.Services.Helpers.Responses;
using System;
using MyTube.Core.Helpers.Extensions;
using System.Linq;
using System.Collections.Generic;
using MyTube.Services.Webinar;
using MyTube.Core.Domain.Webinar;
using MyTube.Core.Domain.Webinar.Enums;
using MyTube.Services.SysSettings;
using MyTube.Services.Helpers.SysSettings;

namespace MyTube.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WebhookController : ControllerBase
    {

        private readonly IWeRaveYouLog _logger;
        private readonly IWebinarService _webinarService;
        private readonly IWebinarZoomRecordingService _webinarZoomRecordingService;
        private readonly ZoomSettings_v2 _zoomSettings;

        public WebhookController(IWeRaveYouLog logger, IWebinarService webinarService, 
                                    IWebinarZoomRecordingService webinarZoomRecordingService, ISysSettingsService sysSettingsService)
        {
            _logger = logger;
            _webinarService = webinarService;
            _webinarZoomRecordingService = webinarZoomRecordingService;

            var settings = sysSettingsService.GetSysSettingsList();
            _zoomSettings = SysSettingsHelper.GetZoomSettings(settings, _logger);
        }

        #region Webinar Event

        [HttpPost]
        [Route("zoom/webinar_event")]
        public async Task<IActionResult> ZoomWebinarEvents()
        {

            string webhook = await ReadZoomResponseAsync(Request);
            if (webhook.HasValue())
            {

                try
                {
                    WebhookWebinarModel model = JsonConvert.DeserializeObject<WebhookWebinarModel>(webhook);
                    if (model != null)
                    {
                        BaseResponse response = null;
                        if (model.@event == _zoomSettings.WebinarStartEvent)
                        {
                            response = await _webinarService.UpdateWebinarAsync(model.payload.@object.id, WebinarStatusType.LiveNow);
                        }
                        else if (model.@event == _zoomSettings.WebinarEndEvent)
                        {
                            response = await _webinarService.UpdateWebinarAsync(model.payload.@object.id, WebinarStatusType.LiveArchive);
                        }

                        if (response != null && response.Success == false)
                        {
                            _logger.Error($"While trying to update webinar.WebinarStatusType from Zoom Webhook");
                            _logger.Error($"id={model.payload.@object.id}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"Cannot deserialize zoom webinar webhook response: {ex}");
                    _logger.Debug($"Zoom webinar webhook response={webhook}");
                }

            }

            return Ok();

        }

        #endregion

        [HttpPost]
        [Route("zoom/recordings_completed_event")]
        public async Task<IActionResult> ZoomAllRecordingsCompletedEvents()
        {


            string webhook = await ReadZoomResponseAsync(Request);
            if (webhook.HasValue())
            {

                try
                {
                    WebhookAllRecordingsCompletedModel model = JsonConvert.DeserializeObject<WebhookAllRecordingsCompletedModel>(webhook);
                    if (model != null)
                    {

                        var zoomWebinar = await _webinarService.GetWebinarAsync(model.payload.@object.id, true);
                        if (zoomWebinar != null)
                        {


                            List<WebinarZoomRecording> recordings = new List<WebinarZoomRecording>();
                            for (var i = 0; i < model.payload.@object.recording_files.LongCount(); i++)
                            {

                                var recording = model.payload.@object.recording_files[i];

                                var zoomWebinarRecording = new WebinarZoomRecording
                                {
                                    WebinarId = zoomWebinar.Id,
                                    FileSize = recording.file_size,
                                    FileType = recording.file_type,
                                    RecordingStart = Convert.ToDateTime(recording.recording_start),
                                    RecordingStop = Convert.ToDateTime(recording.recording_end),
                                    DownloadUrl = recording.download_url,
                                    RecordingStatusType = RecordingStatusType.ForDownload
                                };

                                recordings.Add(zoomWebinarRecording);

                            }

                            BaseResponse response = await _webinarZoomRecordingService.InsertWebinarZoomRecordingAsync(recordings);
                            if (response.Success == false)
                            {
                                _logger.Error($"While trying to save record to webinar_zoom_recording from Zoom Webhook");
                                _logger.Error($"id={model.payload.@object.id}");
                            }
                        }

                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"Cannot deserialize zoom webinar webhook response: {ex}");
                    _logger.Debug($"Zoom webinar webhook response={webhook}");
                }

            }

            return Ok();

        }

        private async Task<string> ReadZoomResponseAsync(HttpRequest Request)
        {
            string response = null;

            if (Request.Headers.ContainsKey("Authorization"))
            {
                string token = Request.Headers["Authorization"];
                if (token == _zoomSettings.WebhookAuthorization)
                {

                    using (Stream receiveStream = Request.Body)
                    {
                        using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8))
                        {
                            response = await readStream.ReadLineAsync();
                        }
                    }

                }
            }


            return response;

        }


    }

}
