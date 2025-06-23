using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.User;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.RegistrationCode
{
    public class RegistrationCodeService : IRegistrationCodeService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor
        
        public RegistrationCodeService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public async Task InsertRegistrationCodeAsync(Core.Domain.RegistrationCode.RegistrationCode registrationCode)
        {

            try
            {

                //  Deactivate first all existing users's registration codes
                _dataContext.RegistrationCodes
                        .Where(p => p.UserId == registrationCode.UserId)
                        .ToList()
                        .ForEach(p => p.Active = false);

                await _dataContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to deactive all existing user's registration codes: {ex}");
                _logger.Debug($"Active=0 WHERE UserId: {registrationCode.UserId}");
            }

            try
            {

                await _dataContext.RegistrationCodes.AddAsync(registrationCode);

                await _dataContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to save record to registration_code table: {ex}");
                _logger.Debug($"RegistrationCode: {registrationCode}");

            }

        }

        public int GetRegistrationCodeCount(string key, string confirmationCode, bool active)
        {

            int count = 0;

            try
            {

                count = _dataContext.RegistrationCodes.AsNoTracking()
                            .Where(p =>
                                        p.Key == key &&
                                        p.ConfirmationCode == confirmationCode &&
                                        p.Active == active)
                            .Count();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from user table: {ex}");
                _logger.Debug($"WHERE Key={key} AND ConfirmationCode={confirmationCode} AND Active={active}");
            }

            return count;

        }

        public async Task<BaseResponse> UpdateRegistrationCodeAsync(Core.Domain.RegistrationCode.RegistrationCode registrationCode)
        {

            BaseResponse response = null;

            if (registrationCode.Key.HasValue() == true && registrationCode.ConfirmationCode.HasValue() == true)
            {

                Core.Domain.RegistrationCode.RegistrationCode objRegisrationCode = null;

                try
                {

                    objRegisrationCode = await _dataContext.RegistrationCodes
                                                        .Where(p =>
                                                                    p.Key == registrationCode.Key &&
                                                                    p.ConfirmationCode == registrationCode.ConfirmationCode &&
                                                                    p.Active == true)
                                                         .SingleOrDefaultAsync();

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from registration_code table: {ex}");
                    _logger.Debug($"WHERE Key={registrationCode.Key} AND ConfirmationCode={registrationCode.ConfirmationCode} AND Active=1");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }

                if (objRegisrationCode != null)
                {

                    Core.Domain.User.User user = null;

                    try
                    {

                        user = await _dataContext.Users
                                            .Where(p =>
                                                        p.Id == objRegisrationCode.UserId &&
                                                        p.UserStatusType == UserStatusType.ForConfirmation)
                                            .SingleOrDefaultAsync();

                    }
                    catch (Exception ex)
                    {
                        _logger.Error($"While trying to get record from user table: {ex}");
                        _logger.Debug($"WHERE Id={objRegisrationCode.UserId} AND UserStatusType={UserStatusType.ForConfirmation}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                    if (user != null)
                    {
                        try
                        {

                            objRegisrationCode.Active = false;
                            _dataContext.RegistrationCodes.Update(objRegisrationCode);

                            user.UserStatusType = UserStatusType.Active;
                            _dataContext.Users.Update(user);

                            if (user.UserType == UserType.Creator)
                            {
                                var statEntity = new Core.Domain.Statistics.Statistics
                                {
                                    ArtistId = user.Id,
                                    ArtistCounter = 1,
                                    DateCounted = DateTime.Now
                                };

                                await _dataContext.Statistics.AddAsync(statEntity);
                            }
                            else if(user.UserType == UserType.Basic)
                            {
                                var statEntity = new Core.Domain.Statistics.Statistics
                                {
                                    UserId = user.Id,
                                    UserCounter = 1,
                                    DateCounted = DateTime.Now
                                };

                                await _dataContext.Statistics.AddAsync(statEntity);
                            }


                            await _dataContext.SaveChangesAsync();

                            response = new SuccessResponse();

                        }
                        catch (Exception ex)
                        {
                            _logger.Error($"While trying to update registration_code or user table: {ex}");
                            _logger.Debug($"registration_code.Active=false WHERE Key={registrationCode.Key} AND ConfirmationCode={registrationCode.ConfirmationCode} AND Active=1");
                            _logger.Debug($"user.UserStatusType={UserStatusType.Active} WHERE Id={objRegisrationCode.UserId} AND UserStatusType={UserStatusType.ForConfirmation}");
                            response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                        }
                    }

                }

            }

            return response;

        }


    }
}
