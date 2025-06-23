using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyTube.Services.Helpers.Settings;

namespace MyTube.API.Helpers.Extensions
{
    public static class WeRaveYouApiSettingsServiceExtension
    {

        public static IServiceCollection AddApiSettings(this IServiceCollection services, IConfiguration configuration)
        {

            var appSettingsSection = configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            var ffsIntegrationSettingsSection = configuration.GetSection("FfsIntegrationSettings");
            services.Configure<FfsIntegrationSettings>(ffsIntegrationSettingsSection);

            return services;

        }

    }
}
