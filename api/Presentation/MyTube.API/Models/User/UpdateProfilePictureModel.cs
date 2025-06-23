using Microsoft.AspNetCore.Http;

namespace MyTube.API.Models.User
{
    public class UpdateProfilePictureModel : BaseAuthorizedModel
    {

        public IFormFile ProfileImage { get; set; }

    }
}
