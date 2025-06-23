using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.SnsAccount
{
    public class SnsAccountService : ISnsAccountService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly IHttpContextAccessor _contextAccessor;

        #endregion

        #region Constructor

        public SnsAccountService(DataContext dataContext, IWeRaveYouLog logger, IHttpContextAccessor contextAccessor)
        {
            _dataContext = dataContext;
            _logger = logger;
            _contextAccessor = contextAccessor;
        }

        #endregion

        public async Task<object> GetSnsAccountAsync()
        {

            BaseResponse response = null;

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if(user != null)
            {

                try
                {

                    var record = await _dataContext.SnsAccounts.AsNoTracking()
                                    .Where(p => p.UserId == user.Id)
                                    .Select(p => new
                                    {
                                        p.Instagram,
                                        p.Facebook,
                                        p.Twitter,
                                        p.Youtube
                                    })
                                    .SingleOrDefaultAsync();

                    response = new SuccessResponse(record);

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from sns_account table: {ex}");
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

        public async Task<BaseResponse> AddUpdateSnsAccountAsync(Core.Domain.SnsAccount.SnsAccount snsAccount)
        {

            BaseResponse response = null;
            Core.Domain.SnsAccount.SnsAccount record = null;

            try
            {

                record = await _dataContext.SnsAccounts.AsNoTracking()
                                    .Where(p => 
                                            p.UserId == snsAccount.UserId)
                                    .SingleOrDefaultAsync();
                
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from sns_account table: {ex}");
                _logger.Debug($"WHERE UserId: {snsAccount.UserId}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            try
            {

                if (record == null)
                {
                    await _dataContext.SnsAccounts.AddAsync(snsAccount);
                }
                else
                {
                    snsAccount.Id = record.Id;
                    _dataContext.SnsAccounts.Update(snsAccount);
                }

                await _dataContext.SaveChangesAsync();

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                if (record == null)
                {
                    _logger.Error($"While trying to save sns_account record: {ex}");
                    _logger.Debug($"SnsAccount={snsAccount}");
                }
                else
                {
                    _logger.Error($"While trying to update sns_account record: {ex}");
                    _logger.Debug($"SnsAccount={snsAccount} WHERE Id={record.Id}");
                }

                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);

            }

            return response;

        }

    }
}
