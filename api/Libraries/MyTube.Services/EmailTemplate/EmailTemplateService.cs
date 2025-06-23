using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.EmailTemplate;
using MyTube.Core.Domain.EmailTemplate.Enums;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.EmailTemplate
{
    public class EmailTemplateService : IEmailTemplateService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public EmailTemplateService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public async Task<Core.Domain.EmailTemplate.EmailTemplate> GetEmailTemplateAsync(EmailTemplateType templateType, int localeType)
        {

            Core.Domain.EmailTemplate.EmailTemplate record = null;

            try
            {

                record = await _dataContext.EmailTemplates.AsNoTracking()
                                    .Where(p => 
                                                p.EmailTemplateType == templateType && 
                                                p.LocaleType == localeType)
                                    .SingleOrDefaultAsync();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to get record from email_template table: {ex}");
                _logger.Debug($"WHERE TemplateType={templateType} LocaleType={localeType}");

            }

            return record;

        }

    }
}
