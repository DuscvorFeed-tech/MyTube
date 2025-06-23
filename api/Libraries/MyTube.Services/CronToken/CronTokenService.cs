using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyTube.Core.Domain.CronToken;
using MyTube.Data;
using MyTube.Services.Helpers.Key;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.CronToken
{
    public class CronTokenService : ICronTokenService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public CronTokenService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public async Task<string> GenerateToken(string cron)
        {

            Core.Domain.CronToken.CronToken record = null;

            string token = null;

            try
            {

                record = await _dataContext.CronTokens
                                    .Where(p =>
                                                p.Cron.ToLower() == cron.ToLower())
                                    .SingleOrDefaultAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from cron_token table: {ex}");
                _logger.Debug($"WHERE Cron={cron}");
            }


            try
            {
                
                token = KeyHelper.Generate(48);

                if (record == null)
                {
                    var objCronToken = new Core.Domain.CronToken.CronToken
                    {
                        Cron = cron,
                        Token = token,
                        Active = true
                    };

                    await _dataContext.CronTokens.AddRangeAsync(objCronToken);
                }
                else
                {
                    record.Token = token;
                    record.Active = true;

                    _dataContext.CronTokens.Update(record);
                }

                await _dataContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save or update cron_token record: {ex}");
                _logger.Debug($"Token={token},Active=true WHERE Cron={cron}");

            }


            return token;

        }

    }
}
