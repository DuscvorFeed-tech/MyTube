using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Zoom
{
    public class ZoomFetcherLogService : IZoomFetcherLogService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public ZoomFetcherLogService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion


        public async Task<BaseResponse> InsertOrUpdateZoomFetcherLog(Core.Domain.Zoom.ZoomFetcherLog zoomFetcherLog)
        {
            try
            {

                var record = await _dataContext.ZoomFetcherLogs
                                        .Where(p => 
                                                p.ZoomAppId == zoomFetcherLog.ZoomAppId)
                                        .SingleOrDefaultAsync();
                if (record == null)
                {

                    await _dataContext.ZoomFetcherLogs.AddAsync(zoomFetcherLog);

                }
                else
                {
                    record.DateFrom = zoomFetcherLog.DateFrom;
                    record.DateTo = zoomFetcherLog.DateTo;
                    _dataContext.ZoomFetcherLogs.Update(record);
                }

                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to insert/update record to zoom_fetcher_log table: {ex}");
                _logger.Debug($"ZoomFetcherLog: {zoomFetcherLog}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }


    }
}
