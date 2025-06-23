using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.Video.Enums;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.Video
{

    [Table("video")]
    public class Video : BaseDomain
    {

        [Required]
        public long UserId { get; set; }

        [Required]
        public VideoType VideoType { get; set; }

        [MaxLength(LengthHelper.Video_Title_MaxLength)]
        public string Title { get; set; }

        [MaxLength(LengthHelper.Video_Description_MaxLength)]
        public string Description { get; set; }

        [Required]
        public TimeSpan Duration { get; set; }

        [MaxLength(LengthHelper.Video_FileExtension_MaxLength)]
        public string FileExtension { get; set; }

        public long Size { get; set; }

        [Required]
        [MaxLength(LengthHelper.Video_Hash_MaxLength)]
        public string Hash { get; set; }

        public bool AntiForgeryLicense { get; set; }

        public bool PaidContent { get; set; }

        public double? PaidContentPrice { get; set; }

        public double? PaidContentFilPrice { get; set; }

        public string PaidContentHash { get; set; }

        [MaxLength(LengthHelper.Video_TransactionHash_MaxLength)]
        public string TransactionHash { get; set; }

        public virtual User.User User { get; set; }

        public virtual VideoThumbnail Thumbnail { get; set; }

        public virtual ICollection<VideoView> Views { get; set; }

        public virtual ICollection<Purchase.Purchase> SubscriptionPurchases { get; set; }


    }
}
