using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.Helpers.File;
using MyTube.Services.Helpers.Ipfs;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Settings;
using MyTube.Services.Helpers.SysSettings;
using MyTube.Services.SysSettings;

namespace MyTube.Services.User
{
    public class UserService : IUserService
    {


        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly AppSettings _appSettings;
        private readonly IpfsSettings_v2 _ipfsSettings;
        private readonly ImageSettings_v2 _imageSettings;

        #endregion

        #region Constructor

        public UserService(DataContext dataContext, IWeRaveYouLog logger,
                            IOptions<AppSettings> appSettings, ISysSettingsService sysSettingsService)
        {
            _dataContext = dataContext;
            _logger = logger;
            _appSettings = appSettings.Value;

            var settings = sysSettingsService.GetSysSettingsList();
            _ipfsSettings = SysSettingsHelper.GetIPFSSettings(settings, _logger);
            _imageSettings = SysSettingsHelper.GetImageSettings(settings, _logger);
        }

        #endregion

        #region Insert

        public async Task<BaseResponse> InsertUserAsync(Core.Domain.User.User user, string password, bool securedFileTransfer)
        {

            try
            {

                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.UserStatusType = securedFileTransfer == true ? UserStatusType.SendSignupConfirmationEmailWithKeys : UserStatusType.SendSignupConfirmationEmail;

                await _dataContext.Users.AddAsync(user);

                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to user table: {ex}");
                _logger.Debug($"User: {user}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }

        #endregion

        #region Login

        public async Task<IActionResult> LoginAsync(string emailUsername, string password)
        {

            var errorResponse = new ErrorResponse("EmailUsernamePassword", MessageHelper.InvalidLoginCredentials, ErrorCodes.InvalidLoginCredentials);

            if (emailUsername.HasValue() == false || password.HasValue() == false)
            {
                return new UnauthorizedObjectResult(errorResponse);
            }

            try
            {

                var authenticatedUser = await _dataContext.Users.AsNoTracking()
                                                    .Where(p =>
                                                                (p.Email.ToLower() == emailUsername.ToLower() || p.Username.ToLower() == emailUsername.ToLower())
                                                                && p.UserStatusType == UserStatusType.Active)
                                                    .SingleOrDefaultAsync();

                if (authenticatedUser == null)
                {
                    return new UnauthorizedObjectResult(errorResponse);
                }

                if (IsPasswordHashVerified(password, authenticatedUser.PasswordHash, authenticatedUser.PasswordSalt) == false)
                {
                    return new UnauthorizedObjectResult(errorResponse);
                }

                var token = GenerateToken(authenticatedUser);

                return new OkObjectResult(token);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user table: {ex}");
                _logger.Debug($"WHERE (Email={emailUsername} OR Username={emailUsername}) AND UserStatusType={UserStatusType.Active}");
                return new UnauthorizedObjectResult(new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError));
            }

        }

        private static bool IsPasswordHashVerified(string password, byte[] storedHash, byte[] storedSalt)
        {

            if (storedHash.Length != 64 || storedSalt.Length != 128)
            {
                return false;
            }

            using (var hmac = new HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i])
                    {
                        return false;
                    }
                }
            }

            return true;

        }

        private object GenerateToken(Core.Domain.User.User authenticatedUser)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, authenticatedUser.Email),
                new Claim(JwtRegisteredClaimNames.Jti, authenticatedUser.Id.ToString()),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(_appSettings.TokenExpiration),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var response = new SuccessResponse(new
            {
                userId = authenticatedUser.Id,
                token = tokenString,
                tokenExpiration = tokenDescriptor.Expires,
                firstLogin = false,
                secureFileTransfer = authenticatedUser.PublicKey.HasValue(),
                creator = authenticatedUser.UserType == UserType.Creator
            });

            return response;

        }

        #endregion

        public Core.Domain.User.User GetUserWithSubscriptionEnabled(string artist)
        {

            try
            {
                return _dataContext.Users.AsNoTracking()
                                        .Include(e => e.SubscriptionSettings)
                                        .Include(e => e.Videos)
                                        .Where(p =>
                                                    p.Username.Equals(artist, StringComparison.OrdinalIgnoreCase) &&
                                                    p.UserType == UserType.Creator
                                                )
                                        .SingleOrDefault();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user table: {ex}");
                _logger.Debug($"WHERE Username={artist}");
                return null;
            }

        }

        public async Task<Core.Domain.User.User> GetUserAsync(long userId)
        {

            Core.Domain.User.User record = null;

            try
            {

                record = await _dataContext.Users.AsNoTracking()
                                        .Include(e => e.ZoomApp)
                                        .Include(e => e.Videos)
                                        .Where(p =>
                                                    p.Id == userId &&
                                                    p.UserStatusType == UserStatusType.Active)
                                        .SingleOrDefaultAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user table: {ex}");
                _logger.Debug($"WHERE Id={userId} AND UserStatusTYpe={UserStatusType.Active}");
            }

            return record;

        }

        public async Task<List<Core.Domain.User.User>> GetUserListAsync(UserStatusType userStatusType)
        {

            List<Core.Domain.User.User> records = null;

            try
            {

                if (userStatusType == UserStatusType.SendSignupConfirmationEmail)
                {
                    records = await _dataContext.Users.AsNoTracking()
                                        .Where(p =>
                                                    p.UserStatusType == userStatusType &&
                                                    p.PublicKey == null)
                                        .ToListAsync();
                }
                else
                {
                    records = await _dataContext.Users.AsNoTracking()
                                        .Where(p =>
                                                    p.UserStatusType == userStatusType)
                                        .ToListAsync();
                }

                return records;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from user table: {ex}");

                if (userStatusType == UserStatusType.SendSignupConfirmationEmail)
                {
                    _logger.Debug($"WHERE UserStatusType={userStatusType} AND p.PublicKey == null");
                }
                else
                {
                    _logger.Debug($"WHERE UserStatusType={userStatusType}");
                }
            }

            return records;

        }

        public async Task<BaseResponse> UpdateUserAsync(long id, UserStatusType userStatusType)
        {

            BaseResponse response = null;
            Core.Domain.User.User record = null;

            try
            {

                record = await _dataContext.Users
                                        .Where(p =>
                                                    p.Id == id)
                                        .SingleOrDefaultAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }


            if (record != null)
            {

                try
                {
                    record.UserStatusType = userStatusType;

                    _dataContext.Users.Update(record);

                    await _dataContext.SaveChangesAsync();

                    response = new SuccessResponse();
                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to update user record: {ex}");
                    _logger.Debug($"UserStatusType={userStatusType} WHERE Id={id}");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }

            }
            else
            {
                _logger.Debug($"User record not found. Updating UserStatusType={userStatusType} failed using this condition: WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            return response;

        }

        public async Task<BaseResponse> UpdateUserAsync(long id, string publicKey, UserStatusType userStatusType)
        {

            BaseResponse response = null;
            Core.Domain.User.User record = null;

            try
            {
                record = await _dataContext.Users
                                    .Where(p =>
                                                p.Id == id)
                                    .SingleOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            if (record != null)
            {
                try
                {
                    record.PublicKey = publicKey;
                    record.UserStatusType = userStatusType;

                    _dataContext.Users.Update(record);

                    await _dataContext.SaveChangesAsync();

                    response = new SuccessResponse();

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to update user record: {ex}");
                    _logger.Debug($"PublicKey={publicKey},UserStatusType={userStatusType} WHERE Id={id}");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }
            }
            else
            {
                _logger.Debug($"User record not found. Updating PublicKey={publicKey} failed using this condition: WHERE Id={id} AND UserStatusType={userStatusType}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            return response;

        }

        public long GetUserCount(string emailUserName, bool filterByEmail)
        {

            long count = 0;
            string filter = emailUserName.ToLower();
            try
            {

                if (filterByEmail == false)
                {
                    count = _dataContext.Users.AsNoTracking()
                                .Where(p =>
                                            p.Username.ToLower() == filter)
                                .LongCount();
                }
                else
                {
                    count = _dataContext.Users.AsNoTracking()
                                .Where(p =>
                                            p.Email.ToLower() == filter)
                                .LongCount();
                }

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from user table: {ex}");

                if (filterByEmail == false)
                {
                    _logger.Debug($"WHERE Username={filter}");
                }
                else
                {
                    _logger.Debug($"WHERE Username={filter}");
                }
            }

            return count;
        }

        public long GetUserCount(string emailUserName, UserStatusType userStatusType, bool filterByEmail)
        {

            long count = 0;
            string filter = emailUserName.ToLower();
            try
            {

                if (filterByEmail == false)
                {
                    count = _dataContext.Users.AsNoTracking()
                                .Where(p =>
                                            p.Username.ToLower() == filter &&
                                            p.UserStatusType == userStatusType)
                                .LongCount();
                }
                else
                {
                    count = _dataContext.Users.AsNoTracking()
                                .Where(p =>
                                            p.Email.ToLower() == filter &&
                                            p.UserStatusType == userStatusType)
                                .LongCount();
                }

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from user table: {ex}");

                if (filterByEmail == false)
                {
                    _logger.Debug($"WHERE Username={filter} AND UserStatusType={userStatusType}");
                }
                else
                {
                    _logger.Debug($"WHERE Username={filter} AND UserStatusType={userStatusType}");
                }
            }

            return count;
        }

        public long? GetUserWithSubscriptionEnabledCount(string artist)
        {

            long? count = null;
            string filter = artist.ToLower();

            try
            {

                count = _dataContext.Users.AsNoTracking()
                            .Include(e => e.SubscriptionSettings)
                            .Where(p =>
                                        p.Username.ToLower() == filter &&
                                        p.UserStatusType == UserStatusType.Active &&
                                        p.UserType == UserType.Creator &&
                                        p.Subscription == true &&
                                        p.SubscriptionSettings.Ref_PlanId != null &&
                                        p.SubscriptionSettings.SubscriptionSettingsType == Core.Domain.SubscriptionSettings.Enums.SubscriptionSettingsType.Active)
                            .LongCount();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from user table: {ex}");
                _logger.Debug($"WHERE Username={filter}");
            }

            return count;
        }
        public async Task<Core.Domain.User.User> GetUserAsync(string emailUserName, UserStatusType userStatusType, bool filterByEmail)
        {

            Core.Domain.User.User record = null;
            string filter = emailUserName.ToLower();
            try
            {

                if (filterByEmail == false)
                {
                    record = await _dataContext.Users.AsNoTracking()
                                .Where(p =>
                                            p.Username.ToLower() == filter &&
                                            p.UserStatusType == userStatusType)
                                .SingleOrDefaultAsync();
                }
                else
                {
                    record = await _dataContext.Users.AsNoTracking()
                                .Where(p =>
                                            p.Email.ToLower() == filter &&
                                            p.UserStatusType == userStatusType)
                                .SingleOrDefaultAsync();
                }

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record from user table: {ex}");

                if (filterByEmail == false)
                {
                    _logger.Debug($"WHERE Username={filter} AND UserStatusType={userStatusType}");
                }
                else
                {
                    _logger.Debug($"WHERE Username={filter} AND UserStatusType={userStatusType}");
                }
            }

            return record;

        }

        public async Task<int?> GetCountAsync(string newUsername, long userId)
        {
            try
            {

                    return await _dataContext.Users.AsNoTracking()
                                .Where(p =>
                                            p.Username.Equals(newUsername, StringComparison.OrdinalIgnoreCase) &&
                                            p.Id != userId)
                                .CountAsync();
            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record count from user table: {ex}");

                _logger.Debug($"WHERE Username={newUsername} AND Id != {userId}");

                return null;
            }

        }

        public async Task<BaseResponse> UpdateUsernameAsync(long id, string username)
        {

            BaseResponse response = null;
            Core.Domain.User.User record = null;

            try
            {
                record = await _dataContext.Users
                                    .Where(p =>
                                                p.Id == id)
                                    .SingleOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            if (record != null)
            {
                try
                {
                    record.Username = username;
                    _dataContext.Users.Update(record);

                    await _dataContext.SaveChangesAsync();

                    response = new SuccessResponse();

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to update user record: {ex}");
                    _logger.Debug($"Username={username} WHERE Id={id}");
                    response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }
            }
            else
            {
                _logger.Debug($"User record not found. Updating Username={username} failed using this condition: WHERE Id={id}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            return response;

        }

        public async Task<BaseResponse> UpdateUserProfileAsync(long id, IFormFile profileImage)
        {
            try
            {
                var record = await _dataContext.Users
                                    .Where(p =>
                                                p.Id == id)
                                    .SingleOrDefaultAsync();

                if(record != null)
                {
                    var folder = _imageSettings.GetProfilePictureTempFolder(_appSettings.UploadFolder, id);

                    var fileHelper = new FileHelper(_logger);
                    var profileImageFileNameOnServer = await fileHelper.Upload(profileImage, folder);
                    if(profileImageFileNameOnServer.HasValue() == false)
                    {
                        return new ErrorResponse("ProfileImage", MessageHelper.FailedUploadingFileToServer, ErrorCodes.FailedUploadingFileToServer);
                    }
                    else
                    {
                        var ipfsHelper = new IpfsHelper(_logger, _ipfsSettings.Host);

                        string profilePictureHash = await ipfsHelper.UploadFileAsync(Path.Combine(folder, profileImageFileNameOnServer));
                        if (profilePictureHash.HasValue() == false)
                        {
                            return new ErrorResponse("ProfileImage", MessageHelper.IPFS_FailedUploadingFile, ErrorCodes.IPFS_FailedUploadingFile);
                        }

                        record.ProfilePictureHash = profilePictureHash;

                        _dataContext.Users.Update(record);

                        await _dataContext.SaveChangesAsync();

                        return new SuccessResponse();
                    }

                }
                else
                {
                    return new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }

    }
}
