using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.Zoom
{

    [Table("zoom_app")]
    public class ZoomApp : BaseDomain
    {

        [Required]
        public long UserId { get; set; }

        [Required]
        [MaxLength(LengthHelper.ZoomApp_ApiKey_MaxLength)]
        public string ApiKey { get; set; }

        [Required]
        [MaxLength(LengthHelper.ZoomApp_ApiSecret_MaxLength)]
        public string ApiSecret { get; set; }

        [MaxLength(LengthHelper.ZoomApp_UserZoomId_MaxLength)]
        public string UserZoomId { get; set; }

        public virtual User.User User { get; set; }

        public virtual ZoomFetcherLog FetcherLog { get; set; }

    }
}
