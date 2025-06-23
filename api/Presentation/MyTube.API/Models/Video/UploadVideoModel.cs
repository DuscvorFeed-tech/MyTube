using Microsoft.AspNetCore.Http;

namespace MyTube.API.Models.Video
{
    public class UploadVideoModel : BaseAuthorizedModel
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public int? VideoType { get; set; }

        public string VideoFileName { get; set; }

        public string VideoThumbnail { get; set; }

        public string Thumbnail1 { get; set; }

        public string Thumbnail2 { get; set; }

        public string Thumbnail3 { get; set; }

        public IFormFile CustomVideoThumbnail { get; set; }

        public int AntiForgeryLicense { get; set; }

        public bool? PaidContent { get; set; }

        public double? PaidContentPrice { get; set; }

        public double? PaidContentFilPrice { get; set; }

    }
}
