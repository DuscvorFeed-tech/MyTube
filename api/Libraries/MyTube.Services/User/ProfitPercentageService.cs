using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.SysSettings;

namespace MyTube.Services.User
{
    public class ProfitPercentageService : IProfitPercentageService
    {
        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private List<Core.Domain.SysSettings.SysSettings> _sysSettings;

        public ProfitPercentageService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;

            SetSysSettings();
        }

        public void SetSysSettings()
        {
            try
            {
                _sysSettings = _dataContext.SysSettings.AsNoTracking().ToList();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from sys_settings table: {ex}");
            }
        }

        public async Task<BaseResponse> InsertProfitPercentageAsync(long userId)
        {

            try
            {

                var existingRecord = await _dataContext.ProfitPercentages
                                                .Where(p =>
                                                            p.UserId == userId)
                                                .SingleOrDefaultAsync();

                if (existingRecord != null)
                {

                    SysSettingsHelper.SetArtistFees(existingRecord, _sysSettings, _logger);

                    try
                    {

                        _dataContext.ProfitPercentages.Update(existingRecord);

                        await _dataContext.SaveChangesAsync();

                        return new SuccessResponse();

                    }
                    catch (Exception ex)
                    {
                        _logger.Error($"While trying to update profit_percentage record: {ex}");
                        _logger.Debug($"PayPerView={NameType.ARTIST_PAYPERVIEW_FEE},LiveTicket={NameType.ARTIST_LIVETICKET_FEE},Subscription={NameType.ARTIST_SUBSCRIPTION_FEE} WHERE UserId={userId}");
                        return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }
                else
                {
                    var entity = new Core.Domain.User.ProfitPercentage
                    {
                        UserId = userId
                    };

                    SysSettingsHelper.SetArtistFees(entity, _sysSettings, _logger);

                    if (entity.PayPerView.HasValue == false)
                    {
                        return new ErrorResponse(NameType.ARTIST_PAYPERVIEW_FEE.ToString(), MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                    }
                    else if (entity.LiveTicket.HasValue == false)
                    {
                        return new ErrorResponse(NameType.ARTIST_LIVETICKET_FEE.ToString(), MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                    }
                    else if (entity.Subscription.HasValue == false)
                    {
                        return new ErrorResponse(NameType.ARTIST_SUBSCRIPTION_FEE.ToString(), MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                    }

                    try
                    {

                        await _dataContext.ProfitPercentages.AddAsync(entity);

                        await _dataContext.SaveChangesAsync();

                        return new SuccessResponse();

                    }
                    catch (Exception ex)
                    {
                        _logger.Error($"While trying to save record to profit_percentage table: {ex}");
                        _logger.Debug($"PayPerView={NameType.ARTIST_PAYPERVIEW_FEE},LiveTicket={NameType.ARTIST_LIVETICKET_FEE},Subscription={NameType.ARTIST_SUBSCRIPTION_FEE},UserId={userId}");
                        return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from profit_percentage table: {ex}");
                _logger.Debug($"WHERE UserId={userId}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

    }
}
