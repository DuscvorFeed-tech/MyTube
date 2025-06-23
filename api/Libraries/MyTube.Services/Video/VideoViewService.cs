using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Video;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Video
{
    public class VideoViewService : IVideoViewService
    {
        
        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        
        public VideoViewService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<BaseResponse> InsertVideoViewAsync(string hash, VideoView videoView)
        {
            try
            {

                var video = _dataContext.Videos.AsNoTracking()
                                        .Where(p =>
                                                    p.Hash == hash ||
                                                    p.PaidContentHash == hash)
                                        .FirstOrDefault();

                if(video != null)
                {

                    videoView.DateWatched = DateTime.Now;
                    videoView.VideoId = video.Id;

                    try
                    {

                        await _dataContext.VideoViews.AddAsync(videoView);

                        await _dataContext.SaveChangesAsync();

                        return new SuccessResponse();

                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to save record to video_view table: {ex1}");
                        _logger.Debug($"VideoView: {videoView}");
                        return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }

                return new ErrorResponse("Hash", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from video table: {ex}");
                _logger.Debug($"WHERE Hash={hash} OR PaidContentHash={hash}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }

    }
}
