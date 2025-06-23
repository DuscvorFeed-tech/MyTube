using System.Threading.Tasks;

namespace MyTube.Services.Gpg
{
    public interface IGpgService
    {

        Task<string> GeneratePublicKeyAsync(string cronToken, long? userId, string privateKey);

    }
}
