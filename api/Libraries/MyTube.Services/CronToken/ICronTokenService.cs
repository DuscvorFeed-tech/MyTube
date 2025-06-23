using System.Threading.Tasks;

namespace MyTube.Services.CronToken
{
    public interface ICronTokenService
    {
        
        Task<string> GenerateToken(string cron);

    }
}
