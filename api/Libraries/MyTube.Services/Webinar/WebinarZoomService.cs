using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Webinar
{
    public class WebinarZoomService : IWebinarZoomService
    {
        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        public WebinarZoomService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<List<Core.Domain.Webinar.WebinarZoom>> GetWebinarZoomListAsync()
        {

            try
            {

                var webinarZoomType = _dataContext.Model.FindEntityType(typeof(Core.Domain.Webinar.WebinarZoom));
                var webinarZoomTableName = webinarZoomType.GetTableName();

                var webinarType = _dataContext.Model.FindEntityType(typeof(Core.Domain.Webinar.Webinar));
                var webinarTableName = webinarType.GetTableName();

                var userType = _dataContext.Model.FindEntityType(typeof(Core.Domain.User.User));
                var userTableName = userType.GetTableName();

                string sql = string.Format("SELECT {0}.* FROM {0} INNER JOIN {1} ON {0}.WebinarId = {1}.Id INNER JOIN {2} ON {1}.CreatedBy = {2}.Id WHERE date_format({1}.WebinarStart, '%Y-%m-%d %H:%i:00') >= date_format(now(), '%Y-%m-%d %H:%i:00') AND {1}.WebinarStatusType={4} AND {2}.UserStatusType={3} AND {0}.StartUrlTokenRefresh <= date_sub(now(),INTERVAL 1 HOUR)", webinarZoomTableName, webinarTableName, userTableName, (int)Core.Domain.User.Enums.UserStatusType.Active, (int)Core.Domain.Webinar.Enums.WebinarStatusType.ScheduleLive);

                try
                {
                    return await _dataContext.WebinarZooms
                                .FromSqlRaw(sql)
                                .AsNoTracking()
                                .Include(e => e.Webinar)
                                    .ThenInclude(e => e.ZoomApp)
                                .ToListAsync();
                }
                catch (Exception ex1)
                {
                    _logger.Error($"While trying to get record from {webinarZoomTableName} JOIN {webinarTableName}: {ex1}");
                    _logger.Debug(sql);
                    return null;
                }
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying get OrderCoupon table name: {ex}");
                return null;
            }

        }

        public async Task<BaseResponse> UpdateWebinarZoomAsync(long id, string start_url)
        {
            BaseResponse response = null;

            try
            {

                var record = await _dataContext.WebinarZooms
                                        .Where(p =>
                                                    p.Id == id)
                                        .FirstOrDefaultAsync();

                if (record != null)
                {

                    try
                    {
                        record.Zoom_start_url = start_url;

                        _dataContext.WebinarZooms.Update(record);

                        await _dataContext.SaveChangesAsync();

                        return new SuccessResponse();

                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update webinar_zoom record: {ex1}");
                        _logger.Debug($"Zoom_start_url={start_url} WHERE Id={id}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }
                else
                {
                    _logger.Debug($"Record not found. Updating Zoom_start_url={start_url} failed using this condition: WHERE Id={id}");
                    response = new ErrorResponse("Id", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from webinar_zoom table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            return response;
        }

    }
}
