using Microsoft.AspNetCore.Http;
using System.Linq;

namespace MyTube.Services.Helpers.Token
{
    public static class TokenHelper
    {
        internal static string GetToken(HttpContext httpContext)
        {
            return httpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        }
    }
}
