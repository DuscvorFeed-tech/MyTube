using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NLog.Extensions.Logging;

namespace MyTube.API
{
    public class Program
    {
        public static void Main(string[] args)
        {

            var host = BuildWebHost(args);

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
            }

            host.Run();

        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                   .ConfigureAppConfiguration((hostingContext, config) =>
                   {
                       var env = hostingContext.HostingEnvironment;

                       config.AddJsonFile("appsettings.json", optional: true)
                           .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);
                       config.AddEnvironmentVariables();

                       IConfigurationRoot conf = new ConfigurationBuilder().AddJsonFile(path: $"appsettings.{env.EnvironmentName}.json").Build();
                       ConfigSettingLayoutRenderer.DefaultConfiguration = conf;

                   })
                   .UseStartup<Startup>()
                   .Build();

    }
}
