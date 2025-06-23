using MyTube.Services.Helpers.FileCoin.Domain;

namespace MyTube.Services.Helpers.FileCoin.Response
{
    public class WalletCreateResponse
    {

        public string WalletAddress { get; set; }

        public FileCoinWalletinfo WalletInfo { get; set; }

    }

}
