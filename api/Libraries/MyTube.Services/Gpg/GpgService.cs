using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.User;
using MyTube.Core.Domain.User.Enums;
using MyTube.Data;
using MyTube.Services.Helpers.Gpg;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Gpg
{
    public class GpgService : IGpgService
    {


        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public GpgService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public async Task<string> GeneratePublicKeyAsync(string cronToken, long? userId, string privateKey)
        {
            
            string key = null;

            Core.Domain.CronToken.CronToken cron = null;

            try
            {

                cron = await _dataContext.CronTokens
                                        .Where(p =>
                                                    p.Token == cronToken &&
                                                    p.Active == true)
                                        .SingleOrDefaultAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from cron_token table: {ex}");
                _logger.Debug($"WHERE Token={cronToken} AND Active=true");
            }

            if (cron != null)
            {
                Core.Domain.User.User record = null;

                try
                {

                    record = await _dataContext.Users
                                            .Where(p =>
                                                        p.Id == userId &&
                                                        p.UserStatusType == UserStatusType.SendSignupConfirmationEmailWithKeys &&
                                                        p.PublicKey == null)
                                            .SingleOrDefaultAsync();

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get record from user table: {ex}");
                    _logger.Debug($"WHERE Id={userId} AND UserStatusType={UserStatusType.SendSignupConfirmationEmailWithKeys}");
                }

                if (record != null)
                {

                    try
                    {

                        var gpgHelper = new GpgHelper(_logger);

                        var userGpgKey = gpgHelper.CreateKey(record.Username, record.Email, privateKey);
                        if (userGpgKey != null)
                        {

                            key = userGpgKey.Fingerprint;

                        }

                    }
                    catch (Exception ex)
                    {
                        _logger.Error($"Failed instantiating GpgHelper: {ex}");
                        _logger.Debug($"new GpgHelper()");
                    }

                }
            }

            return key;

        }


    }
}
