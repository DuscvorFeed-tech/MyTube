using AutoMapper;
using MyTube.API.Models.App;
using MyTube.API.Models.SnsAccount;
using MyTube.API.Models.User;
using MyTube.API.Models.Video;
using MyTube.API.Models.Webinar;
using MyTube.Core.Domain.Zoom;
using MyTube.Core.Domain.RegistrationCode;
using MyTube.Core.Domain.SnsAccount;
using MyTube.Core.Domain.User;
using MyTube.Core.Domain.Video;
using MyTube.Core.Domain.Webinar;

namespace MyTube.API.Helpers
{
    public class AutoMapperProfile : Profile
    {

        public AutoMapperProfile()
        {

            CreateMap<SignUpModel, User>();

            CreateMap<SignUpConfirmationModel, RegistrationCode>();

            CreateMap<ZoomAddModel, ZoomApp>();

            CreateMap<AddUpdateSnsAccountModel, SnsAccount>();

            CreateMap<VideoViewModel, VideoView>();

            CreateMap<UploadVideoModel, Video>();

            CreateMap<UploadVideoModel, VideoThumbnail>();

            CreateMap<AddWebinarModel, Webinar>();

        }

    }
}
