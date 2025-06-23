using Microsoft.AspNetCore.Mvc;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.API.Controllers
{

    [ApiController]
    public class ErrorController : ControllerBase
    {


        [Route("/error/{code:int}")]
        public IActionResult Error(int code)
        {

            string field = "url";

            string message = "" + code;
            if (code == 404)
            {
                message = MessageHelper.Error404;
            }
            else if (code == 415)
            {
                field = "params";
                message = MessageHelper.Error415;
            }
            else if(code == 401)
            {
                field = "user";
                message = MessageHelper.Error401;
            }

            var response = new ErrorResponse(field, message, code);
            return BadRequest(response);

        }

        [Route("/error")]
        public IActionResult Error() => Problem();

    }

}
