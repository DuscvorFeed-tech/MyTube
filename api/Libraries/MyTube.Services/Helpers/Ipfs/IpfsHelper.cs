using Ipfs.CoreApi;
using Ipfs.Http;
using System;
using System.IO;
using System.Threading.Tasks;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Helpers.Ipfs
{
    public class IpfsHelper
    {

        private readonly IWeRaveYouLog _logger;
        private readonly string _host;

        public IpfsHelper(IWeRaveYouLog logger, string host)
        {
            _logger = logger;
            _host = host;
        }

        public async Task<string> UploadFileAsync(string file)
        {
            string hash = null;

            try
            {

                if (System.IO.File.Exists(file) == true)
                {

                    var ipfsClient = new IpfsClient(_host);
                    var options = new AddFileOptions
                    {
                        Pin = true
                    };

                    var response = await ipfsClient.FileSystem.AddFileAsync(file, options);
                    if (response.Id != null)
                    {
                        if (response.Id.Hash != null)
                        {
                            hash = response.Id.Hash.ToString();
                        }
                    }
                }

                return hash;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to upload file to IPFS node: {ex}");
                _logger.Debug($"Host={_host} File={file}");
                return hash;
            }
        }

    }
}
