using Microsoft.AspNetCore.Http;

namespace MyTube.API.Models.Video
{
    public class ProcessVideoModel : BaseAuthorizedModel
    {

        public IFormFile VideoFile { get; set; }

    }
}
