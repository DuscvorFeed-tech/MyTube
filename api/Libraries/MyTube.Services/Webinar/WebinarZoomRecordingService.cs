using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Webinar;
using MyTube.Core.Domain.Webinar.Enums;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Webinar
{
    public class WebinarZoomRecordingService : IWebinarZoomRecordingService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public WebinarZoomRecordingService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public async Task<BaseResponse> InsertWebinarZoomRecordingAsync(WebinarZoomRecording zoomWebinarRecording)
        {

            try
            {
                await _dataContext.WebinarZoomRecordings.AddAsync(zoomWebinarRecording);
                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to webinar_zoom_recording table: {ex}");
                _logger.Debug($"WebinarZoomRecording: {zoomWebinarRecording}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public async Task<BaseResponse> InsertWebinarZoomRecordingAsync(List<WebinarZoomRecording> zoomWebinarRecordings)
        {

            try
            {
                await _dataContext.WebinarZoomRecordings.AddRangeAsync(zoomWebinarRecordings);
                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to webinar_zoom_recording table: {ex}");
                _logger.Debug($"WebinarZoomRecordings: {zoomWebinarRecordings}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public async Task<List<WebinarZoomRecording>> GetWebinarZoomRecordingListAsync(RecordingStatusType recordingStatus, RecordingFileType fileType)
        {

            string strFileType = fileType.ToString();
            List<WebinarZoomRecording> records = null;

            try
            {

                records = await _dataContext.WebinarZoomRecordings.AsNoTracking()
                                    .Include(e => e.Webinar)
                                        .ThenInclude(e => e.ZoomApp)
                                    .Where(p =>
                                                p.RecordingStatusType == recordingStatus &&
                                                p.FileType.ToLower() == strFileType)
                                    .ToListAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar_zoom_recording table: {ex}");
                _logger.Debug($"WHERE RecordingStatusType={recordingStatus} AND FileType={strFileType}");
            }

            return records;

        }

        public async Task<BaseResponse> UpdateWebinarZoomRecordingAsync(long id, TimeSpan duration, RecordingStatusType statusType)
        {
            try
            {

                var record = await _dataContext.WebinarZoomRecordings
                                        .Where(p => 
                                            p.Id == id)
                                        .SingleOrDefaultAsync();

                if (record != null)
                {
                    record.RecordingStatusType = statusType;
                    record.Duration = duration;

                    _dataContext.WebinarZoomRecordings.Update(record);

                    await _dataContext.SaveChangesAsync();
                }

                return new SuccessResponse();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update webinar_zoom_recording record: {ex}");
                _logger.Debug($"RecordingStatusType={statusType},Duration={duration} WHERE Id={id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }

        public async Task<BaseResponse> UpdateWebinarZoomRecordingAsync(List<long> recordings, RecordingStatusType recordingStatus)
        {

            try
            {

                _dataContext.WebinarZoomRecordings
                                        .Where(p =>
                                            recordings.Any(q => q == p.Id))
                                        .ToList()
                                        .ForEach(p => p.RecordingStatusType = recordingStatus);

                await _dataContext.SaveChangesAsync();
                
                return new SuccessResponse();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update webinar_zoom_recording record: {ex}");
                _logger.Debug($"RecordingStatusType={recordingStatus} WHERE Id={recordings}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }
        public async Task<BaseResponse> UpdateWebinarZoomRecordingAsync(long id, long fileSize, string downloadUrl)
        {
            try
            {

                var record = await _dataContext.WebinarZoomRecordings
                                        .Where(p =>
                                            p.Id == id)
                                        .SingleOrDefaultAsync();

                if (record != null)
                {
                    record.FileSize= fileSize;
                    record.DownloadUrl = downloadUrl;

                    _dataContext.WebinarZoomRecordings.Update(record);

                    await _dataContext.SaveChangesAsync();
                }

                return new SuccessResponse();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update webinar_zoom_recording record: {ex}");
                _logger.Debug($"FileSize={fileSize}, DownloadUrl={downloadUrl} WHERE Id={id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }

        public async Task<BaseResponse> UpdateWebinarZoomRecordingAsync(long id, string hash, RecordingStatusType statusType)
        {
            try
            {

                var record = await _dataContext.WebinarZoomRecordings
                                        .Where(p =>
                                            p.Id == id)
                                        .SingleOrDefaultAsync();

                if (record != null)
                {
                    record.Hash = hash;
                    record.RecordingStatusType = statusType;

                    _dataContext.WebinarZoomRecordings.Update(record);

                    await _dataContext.SaveChangesAsync();
                }

                return new SuccessResponse();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update webinar_zoom_recording record: {ex}");
                _logger.Debug($"RecordingStatusType={statusType},Hash={hash} WHERE Id={id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }
    
    
        public async Task<WebinarZoomRecording> GetWebinarZoomRecordingAsync(long webinarId, string fileType)
        {

            try
            {

                var record = await _dataContext.WebinarZoomRecordings.AsNoTracking()
                                        .Where(p =>
                                                    p.WebinarId == webinarId &&
                                                    p.FileType == fileType)
                                        .SingleOrDefaultAsync();

                return record;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar_zoom_recording table: {ex}");
                _logger.Debug($"WHERE ZoomWebinarId={webinarId} AND FileType={fileType}");
                return new WebinarZoomRecording();
            }


        }


    }
}
