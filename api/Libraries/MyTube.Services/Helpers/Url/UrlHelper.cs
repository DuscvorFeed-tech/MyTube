using Microsoft.AspNetCore.Http;
using System.Text.RegularExpressions;

namespace MyTube.Services.Helpers.Url
{
    public static class UrlHelper
    {
        internal static string GetWatchUrl(HttpContext httpContext)
        {

            return $"https://{httpContext.Request.Host.Value}/watch/";

        }

        internal static string GetWatchPaidUrl(HttpContext httpContext)
        {

            return $"https://{httpContext.Request.Host.Value}/watch/paid/";

        }

        public static bool IsUrlValid(string url)
        {
            try
            {
                var urlRegex = new Regex(@"(http(s)?://)?([\w-]+\.)+[\w-]+(/[\w- ;,./?%&=]*)?");
                return urlRegex.IsMatch(url);
            }
            catch
            {
                return false;
            }
        }

    }
}
