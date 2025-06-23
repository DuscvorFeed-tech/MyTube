using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyTube.Core.Domain.EmailTemplate.Enums;
using MyTube.Core.Helpers.Lengths;

namespace MyTube.Core.Domain.EmailTemplate
{

    [Table("email_template")]
    public class EmailTemplate : BaseDomain
    {

        [Required]
        public EmailTemplateType EmailTemplateType { get; set; }

        [Required]
        public int LocaleType { get; set; }

        [Required]
        [MaxLength(LengthHelper.EmailTemplate_Subject_MaxLength)]
        public string Subject { get; set; }

        [Required]
        public string Message { get; set; }

    }
}
