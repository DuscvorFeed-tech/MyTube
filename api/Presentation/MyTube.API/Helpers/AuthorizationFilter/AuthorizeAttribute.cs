using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using MyTube.Core.Domain.User;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.API.Helpers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = (User)context.HttpContext.Items["User"];
            if (user == null)
            {

                var response = new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);

                context.Result = new JsonResult(response) { StatusCode = 401 };

            }
        }
    }
}