using FluentValidation;
using System.Text.RegularExpressions;
using MyTube.API.Models.Video;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Video;

namespace MyTube.API.Validators.Video
{
    public class VideoViewValidator : AbstractValidator<VideoViewModel>
    {

        private readonly IVideoService _videoService;

        public VideoViewValidator(IVideoService videoService)
        {

            _videoService = videoService;

            RuleFor(p => p.Hash)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(HashMustValid)
                    .WithMessage(MessageHelper.NoRecordFound);

            RuleFor(p => p.IpAddress)
                .Cascade(CascadeMode.Stop)
                .NotEmpty()
                    .WithMessage(MessageHelper.Required)
                .Must(MustValidIpAddress)
                    .WithMessage(MessageHelper.Invalid);

        }

        private bool HashMustValid(string hash)
        {

            return _videoService.GetVideoCount(hash) == 1;

        }

        private bool MustValidIpAddress(string ipAddress)
        {
            string Pattern = @"^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$";

            //Regular Expression object    
            var check = new Regex(Pattern);

            return check.IsMatch(ipAddress, 0);

        }

    }
}
