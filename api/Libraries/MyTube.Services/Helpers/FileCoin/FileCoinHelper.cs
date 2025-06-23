using RestSharp;
using System;
using System.Threading.Tasks;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Helpers.FileCoin
{
    public class FileCoinHelper
    {

        private readonly IWeRaveYouLog _logger;

        public FileCoinHelper(IWeRaveYouLog logger)
        {
            _logger = logger;
        }

        public async Task<IRestResponse> WalletCreateAsync(string url)
        {

            try
            {

                var client = new RestClient(url);
                var request = new RestRequest(Method.GET);

                IRestResponse response = await client.ExecuteAsync(request);

                return response;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to create wallet address: {ex}");
                _logger.Debug($"URL={url}");
            }

            return null;

        }

    }
}
