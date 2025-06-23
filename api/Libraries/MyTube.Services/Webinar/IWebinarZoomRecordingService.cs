using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.Webinar;
using MyTube.Core.Domain.Webinar.Enums;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Webinar
{
    public interface IWebinarZoomRecordingService
    {
        
        Task<BaseResponse> InsertWebinarZoomRecordingAsync(List<WebinarZoomRecording> zoomWebinarRecordings);

        Task<List<WebinarZoomRecording>> GetWebinarZoomRecordingListAsync(RecordingStatusType statusType, RecordingFileType fileType);

        Task<BaseResponse> UpdateWebinarZoomRecordingAsync(long id, TimeSpan duration, RecordingStatusType statusType);

        Task<BaseResponse> UpdateWebinarZoomRecordingAsync(long id, string hash, RecordingStatusType statusType);

        Task<WebinarZoomRecording> GetWebinarZoomRecordingAsync(long webinarId, string fileType);

        Task<BaseResponse> InsertWebinarZoomRecordingAsync(WebinarZoomRecording zoomWebinarRecording);

        Task<BaseResponse> UpdateWebinarZoomRecordingAsync(long id, long fileSize, string downloadUrl);

        Task<BaseResponse> UpdateWebinarZoomRecordingAsync(List<long> recordings, RecordingStatusType recordingStatus);

    }
}
