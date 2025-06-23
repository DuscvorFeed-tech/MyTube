using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.SysSettings.Enums;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.SysSettings
{
    public class SysSettingsService : ISysSettingsService
    {
        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        public SysSettingsService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<List<Core.Domain.SysSettings.SysSettings>> GetSysSettingsListAsync()
        {
            try
            {
                return await _dataContext.SysSettings.AsNoTracking().ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from sys_settings table: {ex}");
                _logger.Debug($"WHERE");
                return null;
            }
        }

        public List<Core.Domain.SysSettings.SysSettings> GetSysSettingsList(SettingsType settings)
        {
            try
            {
                string strSettings = settings.ToString();

                return _dataContext.SysSettings.AsNoTracking().Where(p => p.Settings == strSettings).ToList();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from sys_settings table: {ex}");
                _logger.Debug($"WHERE");
                return null;
            }
        }

        public List<Core.Domain.SysSettings.SysSettings> GetSysSettingsList()
        {
            try
            {
                return _dataContext.SysSettings.AsNoTracking().ToList();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from sys_settings table: {ex}");
                _logger.Debug($"WHERE");
                return null;
            }
        }

        public async Task<List<Core.Domain.SysSettings.SysSettings>> GetSysSettingsListAsync(SettingsType settings)
        {
            string strSettings = settings.ToString();

            try
            {
                return await _dataContext.SysSettings.AsNoTracking().Where(p => p.Settings == strSettings).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from sys_settings table: {ex}");
                _logger.Debug($"WHERE Settings={strSettings}");
                return null;
            }
        }

    }
}
