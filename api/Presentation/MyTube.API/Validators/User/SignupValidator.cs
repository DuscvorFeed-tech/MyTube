using FluentValidation;
using System;
using System.Globalization;
using System.Text.RegularExpressions;
using MyTube.API.Models.User;
using MyTube.Core.Helpers.Lengths;
using MyTube.Services.CommonType;
using MyTube.Services.Helpers.Message;
using MyTube.Services.User;

namespace MyTube.API.Validators.User
{
    public class SignUpValidator : AbstractValidator<SignUpModel>
    {

        private readonly IUserService _userService;
        private readonly ICommonTypeService _commonTypeService;

        public SignUpValidator(IUserService userService, ICommonTypeService commonTypeService)
        {

            _userService = userService;
            _commonTypeService = commonTypeService;

            RuleFor(p => p.Username)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MinimumLength(LengthHelper.User_Username_MinLength)
                    .WithMessage(MessageHelper.LessThanRequiredMinLength)
                .MaximumLength(LengthHelper.User_Username_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength)
                .Must(UsernameNotYetTaken)
                    .WithMessage(p => (MessageHelper.AlreadyRegistered));

            RuleFor(p => p.Email)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MaximumLength(LengthHelper.User_Email_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength)
                .Must(EmailValid)
                    .WithMessage(MessageHelper.Invalid)
                .Must(NotYetRegistered)
                    .WithMessage(p => (MessageHelper.AlreadyRegistered));

            RuleFor(p => p.Password)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .MinimumLength(LengthHelper.User_Password_MinLength)
                    .WithMessage(MessageHelper.LessThanRequiredMinLength)
                .MaximumLength(LengthHelper.User_Password_MaxLength)
                    .WithMessage(MessageHelper.MoreThanAllowedMaxLength);

            RuleFor(p => p.ConfirmPassword)
                .Equal(p => p.Password)
                    .WithMessage(MessageHelper.NotMatch);

            RuleFor(p => p.LocaleType)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(ValidLocaleType)
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.UserType)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .IsInEnum()
                    .WithMessage(MessageHelper.Invalid);

            RuleFor(p => p.Agree)
                .Must(AgreeToTermsAndCondition)
                    .WithMessage(MessageHelper.Required);

        }

        private bool EmailValid(string email)
        {
            try
            {
                // Normalize the domain
                email = Regex.Replace(email, @"(@)(.+)$", DomainMapper,
                                      RegexOptions.None, TimeSpan.FromMilliseconds(200));

                // Examines the domain part of the email and normalizes it.
                string DomainMapper(Match match)
                {
                    // Use IdnMapping class to convert Unicode domain names.
                    var idn = new IdnMapping();

                    // Pull out and process domain name (throws ArgumentException on invalid)
                    string domainName = idn.GetAscii(match.Groups[2].Value);

                    return match.Groups[1].Value + domainName;
                }
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
            catch (ArgumentException)
            {
                return false;
            }

            try
            {
                return Regex.IsMatch(email,
                    @"^[^@\s]+@[^@\s]+\.[^@\s]+$",
                    RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }

        private bool ValidLocaleType(int localeType)
        {
            return _commonTypeService.GetCommonTypeCount(Core.Domain.CommonType.CommonTypeList.LocaleType, localeType) == 1;
        }

        private bool UsernameNotYetTaken(string userName)
        {

            return _userService.GetUserCount(userName, false) == 0;

        }

        private bool NotYetRegistered(string email)
        {

            return _userService.GetUserCount(email, true) == 0;

        }

        private bool AgreeToTermsAndCondition(bool value)
        {
            return value == true;
        }

    }
}
