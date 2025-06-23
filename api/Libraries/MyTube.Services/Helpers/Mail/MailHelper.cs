using System;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Helpers.Mail
{
    public class MailHelper
    {

        private readonly IWeRaveYouLog _logger;
        private readonly string _host;
        private readonly int _port;
        private readonly string _userName;
        private readonly string _password;

        public MailHelper(IWeRaveYouLog logger, string smtpHost, int smtpPort, string smtpUsername, string smtpPassword)
        {
            _logger = logger;
            _host = smtpHost;
            _port = smtpPort;
            _userName = smtpUsername;
            _password = smtpPassword;
        }

        public async Task<bool> SendEmailAsync(string from, string to, string subject, string body)
        {

            try
            {
                using (MailMessage mail = new MailMessage())
                {
                    mail.To.Add(to);
                    mail.From = new MailAddress(from);
                    mail.Subject = subject;

                    mail.Body = body;
                    mail.BodyEncoding = Encoding.UTF8;

                    using (SmtpClient smtp = new SmtpClient(_host, _port))
                    {
                        smtp.Credentials = new NetworkCredential(_userName, _password);
                        smtp.EnableSsl = true;
                        await smtp.SendMailAsync(mail);
                    }
                }

                return true;

            }
            catch (Exception ex)
            {
                _logger.Error($"While sending email: {ex}");
                _logger.Debug($"Failed sending email to:{to} using this SMTP settings: Host={_host} Port={_port} MailFrom={from} Username={_userName} Password={_password} Subject={subject} Body={body}");
            }

            return false;

        }

    }

}
