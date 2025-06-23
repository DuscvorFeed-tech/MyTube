using FluentValidation;
using System;
using MyTube.API.Models.Artist;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Message;
using MyTube.Services.User;

namespace MyTube.API.Validators.Artist
{
    public class ArtistPageValidator : AbstractValidator<ArtistPageModel>
    {

        private readonly IUserService _userService;
        private Core.Domain.User.User _artist;

        public ArtistPageValidator(IUserService userService)
        {

            _userService = userService;

            RuleFor(p => p.Artist)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(ValidArtist)
                    .WithMessage(MessageHelper.Invalid)
                .Must(ArtistNotInactive)
                    .WithMessage(MessageHelper.ArtistAccountIsInactive);
        }

        private bool ArtistNotInactive(string artist)
        {
            
            if(_artist != null)
            {
                return _artist.UserStatusType == Core.Domain.User.Enums.UserStatusType.Active;
            }

            return true;

        }

        private bool ValidArtist(string artist)
        {
            if(artist.HasValue())
            {
                _artist = _userService.GetUserWithSubscriptionEnabled(artist);
                if(_artist == null)
                {
                    return false;
                }

                if(_artist.UserStatusType != Core.Domain.User.Enums.UserStatusType.Active &&
                    _artist.UserStatusType != Core.Domain.User.Enums.UserStatusType.Inactive)
                {
                    return false;
                }

            }

            return true;

        }
    }
}
