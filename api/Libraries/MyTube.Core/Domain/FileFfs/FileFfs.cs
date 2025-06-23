using System;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.FileFfs.Enums;

namespace MyTube.Core.Domain.FileFfs
{
    [Table("file_ffs")]
    public class FileFfs : BaseDomain
    {

        public string File { get; set; }

        public bool IsProcessed { get; set; }

        public DateTime? DateProcessed { get; set; }

        public UploadStatusType? UploadStatusType { get; set; }


    }
}
