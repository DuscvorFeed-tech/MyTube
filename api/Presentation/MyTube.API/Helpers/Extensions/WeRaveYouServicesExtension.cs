using Microsoft.Extensions.DependencyInjection;
using MyTube.Services.Zoom;
using MyTube.Services.CommonType;
using MyTube.Services.CronToken;
using MyTube.Services.File;
using MyTube.Services.FileFfsService;
using MyTube.Services.Gpg;
using MyTube.Services.PasswordReset;
using MyTube.Services.RegistrationCode;
using MyTube.Services.SnsAccount;
using MyTube.Services.User;
using MyTube.Services.Video;
using MyTube.Services.Webinar;
using MyTube.Services.Paypal;
using MyTube.Services.Purchase;
using MyTube.Services.SubscriptionSettings;
using MyTube.Services.SysSettings;
using MyTube.Services.FileCoin;
using MyTube.Services.Banner;
using MyTube.Services.Caches;

namespace MyTube.API.Helpers.Extensions
{
    public static class WeRaveYouServicesExtension
    {

        public static IServiceCollection AddWeRaveYouServices(this IServiceCollection services)
        {

            services.AddScoped<IUserService, UserService>();

            services.AddScoped<ICommonTypeService, CommonTypeService>();

            services.AddScoped<ICronTokenService, CronTokenService>();

            services.AddScoped<IGpgService, GpgService>();

            services.AddScoped<IRegistrationCodeService, RegistrationCodeService>();

            services.AddScoped<IZoomAppService, ZoomAppService>();

            services.AddScoped<ISnsAccountService, SnsAccountService>();

            services.AddScoped<IPasswordResetService, PasswordResetService>();

            services.AddScoped<IVideoService, VideoService>();

            services.AddScoped<IVideoViewService, VideoViewService>();

            services.AddScoped<IFileService, FileService>();

            services.AddScoped<IWebinarService, WebinarService>();

            services.AddScoped<IWebinarZoomRecordingService, WebinarZoomRecordingService>();

            services.AddScoped<IFileFfsService, FileFfsService>();

            services.AddScoped<IPaypalService, PaypalService>();

            services.AddScoped<IPurchaseService, PurchaseService>();

            services.AddScoped<IPurchaseCouponService, PurchaseCouponService>();

            services.AddScoped<ISubscriptionSettingsService, SubscriptionSettingsService>();

            services.AddScoped<ISysSettingsService, SysSettingsService>();

            services.AddScoped<IFileCoinService, FileCoinService>();

            services.AddScoped<IBannerService, BannerService>();
            
            services.AddScoped<ICacheService, CacheService>();

            return services;

        }

    }
}
