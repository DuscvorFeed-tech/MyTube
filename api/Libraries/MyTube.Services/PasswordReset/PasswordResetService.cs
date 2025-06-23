using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Data;
using MyTube.Services.Helpers.Key;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.SysSettings;
using MyTube.Services.User;

namespace MyTube.Services.PasswordReset
{
    public class PasswordResetService : IPasswordResetService
    {


        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly IOptions<AppSettings> _appSettings;
        private readonly IUserService _userService;
        private readonly ISysSettingsService _sysSettingsService;

        #endregion

        #region Constructor

        public PasswordResetService(DataContext dataContext, IWeRaveYouLog logger,
                                    IOptions<AppSettings> appSettings,
                                    IUserService userService, ISysSettingsService sysSettingsService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _appSettings = appSettings;
            _userService = userService;
            _sysSettingsService = sysSettingsService;
        }

        #endregion

        public async Task<BaseResponse> ForgotPasswordAsync(string email)
        {

            BaseResponse response = null;
            var user = await _userService.GetUserAsync(email, Core.Domain.User.Enums.UserStatusType.Active, true);

            if (user != null)
            {
                response = await _userService.UpdateUserAsync(user.Id, Core.Domain.User.Enums.UserStatusType.ForgotPasswordRequest);

            }
            else
            {
                response = new ErrorResponse("Email", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
            }


            return response;

        }

        public async Task<BaseResponse> InsertPasswordResetAsync(Core.Domain.PasswordReset.PasswordReset passwordReset)
        {

            BaseResponse response = null;

            try
            {

                //  Deactivate first all existing users's password reset codes
                _dataContext.PasswordResets
                        .Where(p => p.UserId == passwordReset.UserId)
                        .ToList()
                        .ForEach(p => p.Active = false);

                await _dataContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to deactive all existing user's password reset codes: {ex}");
                _logger.Debug($"Active=0 WHERE UserId: {passwordReset.UserId}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            try
            {

                await _dataContext.PasswordResets.AddAsync(passwordReset);

                await _dataContext.SaveChangesAsync();

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to save record to password_reset table: {ex}");
                _logger.Debug($"PasswordReset: {passwordReset}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);

            }

            return response;

        }

        public long GetPasswordResetCount(string key, string confirmationResetCode, Core.Domain.User.Enums.UserStatusType userStatusType)
        {
            long count = 0;

            try
            {

                if (userStatusType == Core.Domain.User.Enums.UserStatusType.ForgotPasswordEmailSent)
                {
                    count = _dataContext.PasswordResets.AsNoTracking()
                                .Where(p =>
                                            p.Key == key &&
                                            p.ConfirmationCode == confirmationResetCode &&
                                            p.Active == true &&
                                            p.ResetCode == null &&
                                            p.DateConfirmed == null &&
                                            p.DateReset == null)
                                .LongCount();
                }
                else if (userStatusType == Core.Domain.User.Enums.UserStatusType.ForgotPasswordConfirmed)
                {
                    count = _dataContext.PasswordResets.AsNoTracking()
                                .Where(p =>
                                            p.Key == key &&
                                            p.ResetCode == confirmationResetCode &&
                                            p.ConfirmationCode != null &&
                                            p.Active == true &&
                                            p.DateConfirmed != null &&
                                            p.DateReset == null)
                                .LongCount();
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from password_reset table: {ex}");
                if(userStatusType == Core.Domain.User.Enums.UserStatusType.ForgotPasswordEmailSent)
                {
                    _logger.Debug($"WHERE Key={key} AND ConfirmationCode={confirmationResetCode} AND Active={true} AND ResetCode=null AND DateConfirmed=null AND DateReset=null");
                }
                else if (userStatusType == Core.Domain.User.Enums.UserStatusType.ForgotPasswordConfirmed)
                {
                    _logger.Debug($"WHERE Key={key} AND ConfirmationCode != null AND Active={true} AND ResetCode={confirmationResetCode} AND DateConfirmed != null AND DateReset=null");
                }
            }

            return count;
        }


        public async Task<BaseResponse> ForgotPasswordConfirmationAsync(string key, string confirmationCode)
        {

            BaseResponse response = null;
            Core.Domain.PasswordReset.PasswordReset passwordReset = null;

            try
            {
                passwordReset = await _dataContext.PasswordResets
                                            .Include(e => e.User)
                                            .Where(p =>
                                                        p.Key == key &&
                                                        p.ConfirmationCode == confirmationCode &&
                                                        p.Active == true &&
                                                        p.ResetCode == null &&
                                                        p.DateConfirmed == null &&
                                                        p.DateReset == null)
                                            .SingleOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from password_reset table: {ex}");
                _logger.Debug($"WHERE Key={key} AND ConfirmationCode={confirmationCode} AND Active=1 AND ResetCode=null AND DateConfirmed=null AND DateReset=null");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            if(passwordReset != null)
            {
                try
                {
                    passwordReset.DateConfirmed = DateTime.Now;
                    passwordReset.ResetCode = KeyHelper.Generate(64);
                    passwordReset.User.UserStatusType = Core.Domain.User.Enums.UserStatusType.ForgotPasswordConfirmed;

                    _dataContext.Update(passwordReset);

                    await _dataContext.SaveChangesAsync();

                    response = new SuccessResponse(new {
                        passwordReset.Key,
                        passwordReset.ResetCode
                    });

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to update password_reset AND user record: {ex}");
                    _logger.Debug($"DateConfirmed={passwordReset.DateConfirmed},ResetCode={passwordReset.ResetCode} WHERE Key={key} AND ConfirmationCode={confirmationCode} AND Active=1 AND ResetCode=null AND DateConfirmed=null AND DateReset=null");
                    _logger.Debug($"UserStatusType={Core.Domain.User.Enums.UserStatusType.ForgotPasswordConfirmed} WHERE Id={passwordReset.UserId}");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }
            }
            else
            {
                response = new ErrorResponse("Key|ConfirmationCode", MessageHelper.Invalid, ErrorCodes.Invalid);
            }

            return response;
        }

        public async Task<BaseResponse> ResetPasswordAsync(string password, string key, string resetCode)
        {

            BaseResponse response = null;
            Core.Domain.PasswordReset.PasswordReset passwordReset = null;

            try
            {
                passwordReset = await _dataContext.PasswordResets
                                            .Include(e => e.User)
                                            .Where(p =>
                                                        p.Key == key &&
                                                        p.ResetCode == resetCode &&
                                                        p.ConfirmationCode != null &&
                                                        p.Active == true &&
                                                        p.DateConfirmed != null &&
                                                        p.DateReset == null)
                                            .SingleOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from password_reset table: {ex}");
                _logger.Debug($"WHERE Key={key} AND ResetCode={resetCode} AND ConfirmationCode != null AND Active=1 AND DateConfirmed != null AND DateReset=null");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            if (passwordReset != null)
            {
                try
                {
                    // Set password_reset update fields value
                    passwordReset.DateReset = DateTime.Now;
                    passwordReset.Active = false;

                    byte[] passwordHash, passwordSalt;
                    var userService = new UserService(this._dataContext, _logger, _appSettings, _sysSettingsService);
                    userService.CreatePasswordHash(password, out passwordHash, out passwordSalt);

                    // Set user update fields value
                    passwordReset.User.PasswordHash = passwordHash;
                    passwordReset.User.PasswordSalt = passwordSalt;
                    passwordReset.User.UserStatusType = Core.Domain.User.Enums.UserStatusType.Active;

                    _dataContext.Update(passwordReset);

                    await _dataContext.SaveChangesAsync();

                    response = new SuccessResponse();

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to update password_reset AND user record: {ex}");
                    _logger.Debug($"DateReset={passwordReset.DateConfirmed},Active=0 WHERE Key={key} AND ResetCode={resetCode} AND Active=1 AND ConfirmationCode != null AND DateConfirmed != null AND DateReset=null");
                    _logger.Debug($"UserStatusType={Core.Domain.User.Enums.UserStatusType.Active},PasswordHash={passwordReset.User.PasswordHash},PasswordSalt={passwordReset.User.PasswordSalt} WHERE Id={passwordReset.UserId}");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }
            }
            else
            {
                response = new ErrorResponse("Key|ResetCode", MessageHelper.Invalid, ErrorCodes.Invalid);
            }

            return response;

        }

    }
}
