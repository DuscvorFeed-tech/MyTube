using System.Threading.Tasks;
using MyTube.Core.Domain.EmailTemplate;
using MyTube.Core.Domain.EmailTemplate.Enums;

namespace MyTube.Services.EmailTemplate
{
    public interface IEmailTemplateService
    {
        
        Task<Core.Domain.EmailTemplate.EmailTemplate> GetEmailTemplateAsync(EmailTemplateType templateType, int localeType);

    }
}
