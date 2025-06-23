using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyTube.API.Models.Password;
using MyTube.Services.PasswordReset;

namespace MyTube.API.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class PasswordController : ControllerBase
    {

        private readonly IPasswordResetService _passwordResetService;

        public PasswordController(IPasswordResetService passwordResetService)
        {
            _passwordResetService = passwordResetService;
        }

        #region Forgot Password

        [HttpPost]
        [Route("forgot")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var response = await _passwordResetService.ForgotPasswordAsync(model.Email);
            return Ok(response);
        }

        [HttpGet]
        [Route("forgot/confirmation")]
        public async Task<IActionResult> ForgotPasswordConfirmation(ForgotPasswordConfirmationModel model)
        {
            var response = await _passwordResetService.ForgotPasswordConfirmationAsync(model.Key, model.ConfirmationCode);
            return Ok(response);
        }

        #endregion

        #region Reset Password

        [HttpPost]
        [Route("reset")]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordModel model)
        {
            var response = await _passwordResetService.ResetPasswordAsync(model.Password, model.Key, model.ResetCode);
            return Ok(response);
        }

        #endregion

    }

}
