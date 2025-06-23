using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyTube.Core.Domain.CommonType
{

    [Table("common_type")]
    public class CommonType : BaseDomain
    {

        [Required]
        public string Type { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string NameEn { get; set; }

        [Required]
        public int Value { get; set; }

        [Required]
        public int Sort { get; set; }

    }
}
