using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.API.Helpers
{
    public class ModelStateFilter : ActionFilterAttribute
    {

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var error = GetError(context);

                context.Result = new BadRequestObjectResult(error);
            }

            if (context.ActionArguments.ContainsKey("model"))
            {
                var request = context.ActionArguments["model"];
                var userIdProperty = request?.GetType().GetProperties().FirstOrDefault(x => x.Name == "UserId");

                if (userIdProperty != null)
                {

                    var user = (Core.Domain.User.User)context.HttpContext.Items["User"];
                    if (user != null)
                    {
                        userIdProperty.SetValue(request, user.Id);
                    }

                }

            }

        }

        private static ErrorResponse GetError(ActionExecutingContext context)
        {
            var response = new ErrorResponse();

            var errors = from item in context.ModelState where item.Value.Errors.Count > 0 select item;
            foreach (var error in errors)
            {

                foreach (var modelError in error.Value.Errors)
                {

                    var errMsg = modelError.ErrorMessage;
                    var errCode = "0";

                    if (errMsg.ToLower().Contains("could not convert ") || 
                        errMsg.ToLower().Contains("unexpected character encountered while parsing") ||
                        errMsg.ToLower().Contains("error converting value") ||
                        errMsg.ToLower().Contains("is not valid for") ||
                        errMsg.ToLower().Contains("is not valid.") ||
                        errMsg.ToLower().Contains("the value '' is invalid.") ||
                        errMsg.ToLower().Contains("unexpected end when reading json.") ||
                        errMsg.ToLower().Contains("unterminated string. expected delimiter:"))
                    {
                        errCode = ErrorCodes.Invalid;
                        errMsg = MessageHelper.Invalid;
                    }
                    else
                    {
                        errCode = ErrorCodes.GetErrorCode(errMsg);
                    }

                    response.AddError(error.Key, errMsg, errCode);

                }

            }

            return response;

        }

    }
}
