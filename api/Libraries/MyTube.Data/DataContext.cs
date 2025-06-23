using Microsoft.EntityFrameworkCore;
using MyTube.Core.Domain.Zoom;
using MyTube.Core.Domain.CommonType;
using MyTube.Core.Domain.CronToken;
using MyTube.Core.Domain.EmailTemplate;
using MyTube.Core.Domain.FileFfs;
using MyTube.Core.Domain.PasswordReset;
using MyTube.Core.Domain.RegistrationCode;
using MyTube.Core.Domain.SnsAccount;
using MyTube.Core.Domain.User;
using MyTube.Core.Domain.Video;
using MyTube.Core.Domain.Webinar;
using MyTube.Core.Domain.Purchase;
using MyTube.Core.Domain.SubscriptionSettings;
using MyTube.Core.Domain.Admin;
using MyTube.Core.Domain.Sales;
using MyTube.Core.Domain.SysSettings;
using MyTube.Core.Domain.Payout;
using MyTube.Core.Domain.Statistics;
using MyTube.Core.Domain.Caches;
using MyTube.Core.Domain.CronSchedules;

namespace MyTube.Data
{
    public class DataContext : DbContext
    {

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }

        public DbSet<RegistrationCode> RegistrationCodes { get; set; }

        public DbSet<EmailTemplate> EmailTemplates { get; set; }

        public DbSet<Cache> Caches { get; set; }

        public DbSet<CommonType> CommonTypes { get; set; }

        public DbSet<CronToken> CronTokens { get; set; }

        public DbSet<CronSchedule> CronSchedules { get; set; }

        public DbSet<SnsAccount> SnsAccounts { get; set; }

        public DbSet<ZoomApp> ZoomApps { get; set; }

        public DbSet<PasswordReset> PasswordResets { get; set; }

        public DbSet<Video> Videos { get; set; }

        public DbSet<VideoView> VideoViews { get; set; }

        public DbSet<VideoThumbnail> VideoThumbnails { get; set; }

        public DbSet<FileFfs> FileFfs { get; set; }

        public DbSet<Webinar> Webinars { get; set; }

        public DbSet<WebinarPerformer> WebinarPerformers { get; set; }

        public DbSet<WebinarZoom> WebinarZooms { get; set; }

        public DbSet<WebinarZoomRecording> WebinarZoomRecordings { get; set; }

        public DbSet<ZoomFetcherLog> ZoomFetcherLogs { get; set; }

        public DbSet<Purchase> Purchases { get; set; }

        public DbSet<PurchaseCoupon> PurchaseCoupons { get; set; }

        public DbSet<SubscriptionSettings> SubscriptionSettings { get; set; }

        public DbSet<PurchaseSubscription> PurchaseSubscriptions { get; set; }

        public DbSet<Admin> Admins { get; set; }

        public DbSet<SysSettings> SysSettings { get; set; }

        public DbSet<Sales> Sales { get; set; }

        public DbSet<ProfitPercentage> ProfitPercentages { get; set; }

        public DbSet<PayoutHeader> PayoutHeaders { get; set; }

        public DbSet<PayoutArtist> PayoutArtists { get; set; }

        public DbSet<PayoutItem> PayoutItems { get; set; }

        public DbSet<Statistics> Statistics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            SetDefaultValues(modelBuilder);

            base.OnModelCreating(modelBuilder);

        }

        private void SetDefaultValues(ModelBuilder modelBuilder)
        {


            #region Webinar
            modelBuilder.Entity<Webinar>()
                        .HasOne(e => e.CreatedByUser)
                        .WithMany(e => e.Webinars)
                        .HasForeignKey(p => p.CreatedBy)
                        .HasPrincipalKey(p => p.Id);
            #endregion

        }



    }
}
