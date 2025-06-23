using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using RestSharp.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Domain.Zoom;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;

namespace MyTube.Services.Zoom
{
    public class ZoomAppService : IZoomAppService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ZoomSettings_v2 _zoomSettings;

        #endregion

        #region Constructor

        public ZoomAppService(DataContext dataContext, IWeRaveYouLog logger, 
                                IHttpContextAccessor contextAccessor, ISysSettingsService sysSettingsService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _contextAccessor = contextAccessor;

            var settings = sysSettingsService.GetSysSettingsList();
            _zoomSettings = SysSettingsHelper.GetZoomSettings(settings, _logger);
        }

        #endregion

        public async Task<BaseResponse> InsertZoomAppAsync(ZoomApp zoomApp)
        {

            if (_zoomSettings != null)
            {
                var zoomApiHelper = new Helpers.ZoomApi.ZoomApiHelper(_logger, zoomApp.ApiKey, zoomApp.ApiSecret);
                var token = zoomApiHelper.GenerateToken(_zoomSettings.GetUserZoomIdTokenExpiration);
                if (token.HasValue())
                {
                    var userZoomId = await zoomApiHelper.GetZoomId(_zoomSettings.GetListUsersUrl(), token);
                    if (userZoomId.HasValue())
                    {

                        try
                        {

                            zoomApp.UserZoomId = userZoomId;

                            await _dataContext.ZoomApps.AddAsync(zoomApp);

                            await _dataContext.SaveChangesAsync();

                            return new SuccessResponse();

                        }
                        catch (Exception ex)
                        {
                            _logger.Error($"While trying to save record to zoom_app table: {ex}");
                            _logger.Debug($"UserId={zoomApp.UserId} ApiKey={zoomApp.ApiKey} ApiSecret={zoomApp.ApiSecret}");
                            return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                        }

                    }
                    else
                    {
                        return new ErrorResponse("ZoomId", MessageHelper.Zoom_FailedFetchingZoomId, ErrorCodes.Zoom_FailedFetchingZoomId);
                    }
                }
                else
                {
                    return new ErrorResponse("ApiKey|ApiSecret", MessageHelper.Zoom_FailedGeneratingToken, ErrorCodes.Zoom_FailedGeneratingToken);
                }
            }
            else
            {
                return new ErrorResponse("ZoomSettings", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
            }
        }

        public async Task<object> GetZoomAppAsync()
        {

            BaseResponse response = new SuccessResponse();

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if (user != null)
            {

                try
                {

                    var record = await _dataContext.ZoomApps.AsNoTracking()
                                .Where(p => p.UserId == user.Id)
                                .Select(p => new
                                {
                                    p.ApiKey,
                                    p.ApiSecret,
                                    ZoomId = p.UserZoomId
                                })
                                .SingleOrDefaultAsync();

                    if (record != null)
                    {
                        response = new SuccessResponse(record);
                    }

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from zoom_app table: {ex}");
                    _logger.Debug($"WHERE UserId: {user.Id}");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }

            }
            else
            {
                _logger.Debug($"Cannot get user information from HttpContext: {_contextAccessor}");
                response = new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
            }

            return response;

        }

        public long GetZoomAppCount(UserType userType)
        {

            try
            {

                var count = _dataContext.ZoomApps.AsNoTracking()
                            .Include(e => e.User)
                            .Where(p =>
                                    p.ApiKey != null &&
                                    p.ApiSecret != null &&
                                    p.UserZoomId != null &&
                                    p.User.UserType == userType)
                            .LongCount();

                return count; 

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from zoom_app table: {ex}");
                _logger.Debug($"WHERE User.UserType={userType} AND ApiKey != null AND ApiSecret != null AND UserZoomId != null");

            }

            return 0;

        }

        public int GetZoomAppCount(string apiKey, string apiSecret)
        {

            int count = 0;
            try
            {

                count = _dataContext.ZoomApps.AsNoTracking()
                            .Where(p =>
                                        p.ApiKey.ToLower() == apiKey.ToLower() &&
                                        p.ApiSecret.ToLower() == apiSecret.ToLower())
                            .Count();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from zoom_app table: {ex}");
                _logger.Debug($"WHERE ApiKey={apiKey} AND ApiSecret={apiSecret}");

            }

            return count;

        }

        public int GetZoomAppCount(long id, bool idIsEqualToUserId)
        {

            int count = 0;
            try
            {

                if (idIsEqualToUserId == true)
                {
                    count = _dataContext.ZoomApps.AsNoTracking()
                                .Where(p =>
                                            p.UserId == id &&
                                            p.ApiKey != null &&
                                            p.ApiSecret != null &&
                                            p.UserZoomId != null)
                                .Count();

                }
                else
                {
                    count = _dataContext.ZoomApps.AsNoTracking()
                                .Where(p =>
                                            p.Id == id &&
                                            p.ApiKey != null &&
                                            p.ApiSecret != null &&
                                            p.UserZoomId != null)
                                .Count();
                }

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from zoom_app table: {ex}");
                if (idIsEqualToUserId == true)
                {
                    _logger.Debug($"WHERE UserId={id} AND ApiKey != null AND ApiSecret != null AND UserZoomId != null");
                }
                else
                {
                    _logger.Debug($"WHERE Id={id} AND ApiKey != null AND ApiSecret != null AND UserZoomId != null");
                }

            }

            return count;

        }

        public async Task<ZoomApp> GetZoomAppAsync(long id, bool idIsEqualToUserId, bool findCreatorSharedZoomApp)
        {

            ZoomApp record = null;

            try
            {

                if (idIsEqualToUserId == true)
                {

                    record = await _dataContext.ZoomApps.AsNoTracking()
                                .Include(e => e.User)
                                .Where(p =>
                                            p.UserId == id &&
                                            p.ApiKey != null &&
                                            p.ApiSecret != null &&
                                            p.UserZoomId != null)
                                .OrderByDescending(p => p.Id)
                                .FirstOrDefaultAsync();

                    if(record == null && findCreatorSharedZoomApp == true)
                    {

                        record = await _dataContext.ZoomApps.AsNoTracking()
                                    .Include(e => e.User)
                                    .Where(p =>
                                                p.User.UserType == UserType.Creator &&
                                                p.ApiKey != null &&
                                                p.ApiSecret != null &&
                                                p.UserZoomId != null)
                                    .OrderByDescending(p => p.Id)
                                    .FirstOrDefaultAsync();

                    }

                }
                else
                {
                    record = await _dataContext.ZoomApps.AsNoTracking()
                                .Include(e => e.User)
                                .Where(p =>
                                            p.Id == id &&
                                            p.ApiKey != null &&
                                            p.ApiSecret != null &&
                                            p.UserZoomId != null)
                                .SingleOrDefaultAsync();
                }

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record from zoom_app table: {ex}");
                if (idIsEqualToUserId == true)
                {
                    _logger.Debug($"WHERE UserId={id} AND ApiKey != null AND ApiSecret != null AND UserZoomId != null");
                }
                else
                {
                    _logger.Debug($"WHERE Id={id} AND ApiKey != null AND ApiSecret != null AND UserZoomId != null");
                }

            }

            return record;

        }

        public async Task<List<ZoomApp>> GetZoomAppListAsync()
        {

            List<ZoomApp> records = null;

            try
            {

                records = await _dataContext.ZoomApps.AsNoTracking()
                                        .Include(e => e.User)
                                        .Include(e => e.FetcherLog)
                                        .Where(p =>
                                                    p.ApiKey != null &&
                                                    p.ApiSecret != null &&
                                                    p.UserZoomId != null)
                                        .ToListAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from zoom_app table: {ex}");
                _logger.Debug($"WHERE ApiKey != null AND ApiSecret != null AND UserZoomId != null");
            }


            return records;
        }

    }

}
