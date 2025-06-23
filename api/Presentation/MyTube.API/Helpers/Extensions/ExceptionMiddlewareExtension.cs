using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Text.Json;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Responses;

namespace MyTube.API.Helpers.Extensions
{
    public static class ExceptionMiddlewareExtension
    {

        public static void ConfigureExceptionHandler(this IApplicationBuilder app, IWeRaveYouLog logger)
        {
            app.UseExceptionHandler((System.Action<IApplicationBuilder>)(appError =>
            {
                appError.Run((RequestDelegate)(async context =>
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.ContentType = "application/json";

                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                    if (contextFeature != null)
                    {

                        logger.Error($"Unhandled exception occurred: {contextFeature.Error}");

                        string field = "server";
                        string message = "Internal Server Error. Please see logs for more info.";

                        var response = new ErrorResponse((string)field, (string)message, (int)context.Response.StatusCode);

                        var resp = JsonSerializer.Serialize(response);

                        await context.Response.WriteAsync(resp);

                    }
                }));
            }));
        }

    }
}
