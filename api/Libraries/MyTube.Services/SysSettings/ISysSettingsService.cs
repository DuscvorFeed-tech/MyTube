using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.SysSettings.Enums;

namespace MyTube.Services.SysSettings
{
    public interface ISysSettingsService
    {
        
        Task<List<Core.Domain.SysSettings.SysSettings>> GetSysSettingsListAsync();

        List<Core.Domain.SysSettings.SysSettings> GetSysSettingsList();

        List<Core.Domain.SysSettings.SysSettings> GetSysSettingsList(SettingsType settings);

        Task<List<Core.Domain.SysSettings.SysSettings>> GetSysSettingsListAsync(SettingsType settings);

    }
}
