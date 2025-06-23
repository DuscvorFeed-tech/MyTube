using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.SubscriptionSettings.Enums;
using MyTube.Core.Domain.User.Enums;
using MyTube.Services.Helpers.Filter.Artist;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.SubscriptionSettings
{
    public interface ISubscriptionSettingsService
    {
        
        Task<BaseResponse> GetSubscriptionSettingsAsync();

        Task<BaseResponse> InsertUpdateSubscriptionSettingsAsync(long userId, bool? onSubscription, double? amount);
        
        long? GetSubscriptionSettingsCount(long userId, SubscriptionSettingsType[] types);
        
        Task<List<Core.Domain.SubscriptionSettings.SubscriptionSettings>> GetSubscriptionSettingsListAsync(SubscriptionSettingsType subscriptionSettingsType);
        
        Task<BaseResponse> UpdateSubscriptionSettingsAsync(long id, string planId, SubscriptionSettingsType subscriptionSettingsType);

        Task<object> FilterSubscriptionSettingsListAsync(ArtistFilter filter);
        
        long? GetSubscriptionSettingsCount(string artist, bool subscription, UserType userType, UserStatusType userStatusType, SubscriptionSettingsType subscriptionSettingsType);

        Task<BaseResponse> GetArtistVideosAsync(ArtistFilter filter);

        Core.Domain.SubscriptionSettings.SubscriptionSettings GetSubscriptionSettings(string artist, bool subscription, UserType userType, UserStatusType userStatusType, SubscriptionSettingsType subscriptionSettingsType);

    }
}
