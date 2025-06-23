using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyTube.Core.Domain.User.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.User;

namespace MyTube.API.Controllers
{

    [ApiController]
    public class BaseAuthorizedController : ControllerBase
    {

        private Core.Domain.User.User GetUser()
        {

            var user = (Core.Domain.User.User)this.HttpContext.Items["User"];

            return user;

        }

        protected object GetUserProfile(Services.Helpers.Settings.ImageSettings_v2 imageSettings)
        {
            var user = GetUser();

            return new SuccessResponse(new { 
            
                user.Id,
                user.Username,
                user.Email,
                ProfilePictureUrl = user.ProfilePictureHash.HasValue() == true ?
                                    string.Format(imageSettings.ServerUrl, user.ProfilePictureHash)
                                    :  "",
                secureFileTransfer = user.PublicKey.HasValue(),
                creator = user.UserType == UserType.Creator,
                videoCount = user.Videos?.LongCount()
            });

        }

        protected async Task<Core.Domain.User.User> GetUserAsync(IUserService userService, string secret, string token)
        {

            Core.Domain.User.User user = null;

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(secret);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = long.Parse(jwtToken.Claims.First(x => x.Type == "jti").Value);

                user = await userService.GetUserAsync(userId);

            }
            catch
            {
                // do nothing if jwt validation fails
                // user is not attached to context so request won't have access to secure routes
            }

            return user;

        }

    }

}
