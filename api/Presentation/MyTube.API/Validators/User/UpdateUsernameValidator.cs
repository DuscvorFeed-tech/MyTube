using FluentValidation;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading;
using System.Threading.Tasks;
using MyTube.API.Models.User;
using MyTube.Core.Helpers.Lengths;
using MyTube.Services.Helpers.Message;
using MyTube.Services.User;

namespace MyTube.API.Validators.User
{
    public class UpdateUsernameValidator : AbstractValidator<UpdateUsernameModel>
    {

        private readonly IUserService _userService;
        private readonly Core.Domain.User.User _loggendOnUser;

        public UpdateUsernameValidator(IUserService userService, IHttpContextAccessor contextAccessor)
        {

            _userService = userService;

            _loggendOnUser = (Core.Domain.User.User)contextAccessor.HttpContext.Items["User"];

            RuleFor(p => p.Username)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MinimumLength(LengthHelper.User_Username_MinLength)
                    .WithMessage(MessageHelper.LessThanRequiredMinLength)
                .MaximumLength(LengthHelper.User_Username_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength)
                .MustAsync(UsernameNotYetTaken)
                    .WithMessage(p => (MessageHelper.AlreadyRegistered));

        }

        private async Task<bool> UsernameNotYetTaken(string username, CancellationToken token)
        {
            if (_loggendOnUser != null)
            {
                return await _userService.GetCountAsync(username, _loggendOnUser.Id) == 0;
            }

            return false;

        }

    }
}
