using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.User.Enums;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.User
{
    public interface IUserService
    {

        #region Insert

        Task<BaseResponse> InsertUserAsync(Core.Domain.User.User user, string password, bool securedFileTransfer);

        #endregion

        #region Update

        Task<BaseResponse> UpdateUserAsync(long id, UserStatusType userStatusType);

        Task<BaseResponse> UpdateUserAsync(long id, string publicKey, UserStatusType userStatusType);

        #endregion

        #region Get

        long GetUserCount(string emailUserName, bool filterByEmail);

        long GetUserCount(string emailUserName, UserStatusType userStatusType, bool filterByEmail);
        
        Core.Domain.User.User GetUserWithSubscriptionEnabled(string artist);

        long? GetUserWithSubscriptionEnabledCount(string artist);

        Task<Core.Domain.User.User> GetUserAsync(string emailUserName, UserStatusType userStatusType, bool filterByEmail);

        Task<Core.Domain.User.User> GetUserAsync(long userId);

        Task<List<Core.Domain.User.User>> GetUserListAsync(UserStatusType userStatusType);

        #endregion

        Task<IActionResult> LoginAsync(string emailUsername, string password);
        
        Task<int?> GetCountAsync(string newUsername, long userId);
        
        Task<BaseResponse> UpdateUserProfileAsync(long id, IFormFile profileImage);
        
        Task<BaseResponse> UpdateUsernameAsync(long id, string username);

    }
}
