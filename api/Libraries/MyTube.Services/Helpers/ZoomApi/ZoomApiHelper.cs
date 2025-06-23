using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Extensions;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MyTube.Core.Domain.Zoom;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.ZoomApi.Response;
using MyTube.Services.Helpers.ZoomApi.Response.Domain;

namespace MyTube.Services.Helpers.ZoomApi
{
    public class ZoomApiHelper
    {

        private readonly IWeRaveYouLog _logger;
        private readonly string _apiKey;
        private readonly string _apiSecret;
        private readonly int _tokenExpiration;
        private readonly string _zoomUserId;

        
        public ZoomApiHelper(IWeRaveYouLog logger, string apiKey, string apiSecret)
        {
            _logger = logger;
            _apiKey = apiKey;
            _apiSecret = apiSecret;
        }

        public ZoomApiHelper(IWeRaveYouLog zoomcordingLog, ZoomApp app, int tokenExpiration)
        {
            _logger = zoomcordingLog;
            _apiKey = app.ApiKey;
            _apiSecret = app.ApiSecret;
            _tokenExpiration = tokenExpiration;

            if (app == null || app.UserZoomId == null)
            {
                throw new Exception("ZoomApp.UserZoomId must not be null");
            }
            else
            {
                _zoomUserId = app.UserZoomId;
            }
        }


        /// <summary>
        /// Used to generate token
        /// </summary>
        /// <param name="tokenExpiration">Token expiration in hour</param>
        /// <returns>Returns generated token if success, otherwise null</returns>
        public string GenerateToken(int tokenExpiration)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_apiSecret);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Iss, _apiKey),
                };

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddHours(tokenExpiration),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                
                return tokenHandler.WriteToken(token);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to generate Token: {ex}");
                _logger.Debug($"Api Key={_apiKey} Api Secret={_apiSecret} Token Expiration={tokenExpiration}");
            }

            return null;

        }

        /// <summary>
        /// Used to get user Zoom Id
        /// </summary>
        /// <param name="listUsersUrl">Zoom url for Users->List Users</param>
        /// <param name="token">Generated token</param>
        /// <returns>Returns user zoom id if success, otherwise null</returns>
        public async Task<string> GetZoomId(string listUsersUrl, string token)
        {

            try
            {

                var client = new RestClient(listUsersUrl);

                var request = new RestRequest(Method.GET);

                request.AddHeader("content-type", "application/json");
                request.AddHeader("authorization", "Bearer " + token);

                IRestResponse response = await client.ExecuteAsync(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    ZoomUsersResponse zoomUsersResponse = JsonConvert.DeserializeObject<ZoomUsersResponse>(response.Content);
                    if (zoomUsersResponse != null)
                    {
                        if (zoomUsersResponse.users.Length == 1)
                        {
                            if (zoomUsersResponse.users[0].id.HasValue())
                            {
                                return zoomUsersResponse.users[0].id;
                            }
                            else
                            {
                                _logger.Error($"Zoom User Id is null or empty");
                                _logger.Debug($"URL={listUsersUrl} Token={token} Users={zoomUsersResponse.users[0]}");
                            }
                        }
                        else
                        {
                            _logger.Error($"Zoom User is more than one");
                            _logger.Debug($"URL={listUsersUrl} Token={token} Users={zoomUsersResponse.users}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Cannot deserialize zoom api response");
                        _logger.Debug($"URL={listUsersUrl} Token={token} Response={response.Content}");
                    }
                }
                else
                {
                    _logger.Error($"Zoom Api expected to return OK status code but returned other response");
                    _logger.Debug($"URL={listUsersUrl} Token={token} Response={response}");
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While getting user information: {ex}");
                _logger.Debug($"URL={listUsersUrl} Token={token}");

            }

            return null;

        }

        public async Task<ZoomCreateWebinarResponse> CreateWebinar(string listWebinarsUrl, object webinar)
        {
            var token = this.GenerateToken(_tokenExpiration);
            if(token.HasValue())
            {

                try
                {

                    var client = new RestClient(string.Format(listWebinarsUrl, _zoomUserId));

                    var request = new RestRequest(Method.POST);

                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);
                    request.AddParameter("application/json", JsonConvert.SerializeObject(webinar), ParameterType.RequestBody);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == System.Net.HttpStatusCode.Created)
                    {
                        ZoomCreateWebinarResponse zoomResponse = JsonConvert.DeserializeObject<ZoomCreateWebinarResponse>(response.Content);
                        if (zoomResponse != null)
                        {
                            return zoomResponse;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize zoom api response");
                            _logger.Debug($"URL={listWebinarsUrl} Token={token} Response={response.Content}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Zoom Api expected to return Created status code but returned other response");
                        _logger.Debug($"URL={listWebinarsUrl} Token={token} Response={response}");
                    }

                }
                catch (Exception ex)
                {
                    _logger.Error($"While creating webinar: {ex}");
                    _logger.Debug($"URL={listWebinarsUrl} Token={token}");
                }

            }

            return null;
        }

        public async Task<ZoomRecordingsResponse> GetRecordingAsync(string listAllRecordingsUrl, DateTime? dateFrom, DateTime? dateTo)
        {
            return await this.GetRecordingAsync(listAllRecordingsUrl, Convert.ToDateTime(dateFrom), Convert.ToDateTime(dateTo));
        }

        public async Task<ZoomRecordingsResponse> GetRecordingAsync(string listAllRecordingsUrl, DateTime dateFrom, DateTime dateTo)
        {

            var token = this.GenerateToken(_tokenExpiration);
            if(token.HasValue())
            {
                try
                {
                    var client = new RestClient(string.Format(listAllRecordingsUrl, _zoomUserId, dateFrom.ToString("yyyy-MM-dd"), dateTo.ToString("yyyy-MM-dd")));

                    var request = new RestRequest(Method.GET);

                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        ZoomRecordingsResponse zoomResponse = JsonConvert.DeserializeObject<ZoomRecordingsResponse>(response.Content);
                        if (zoomResponse != null)
                        {
                            return zoomResponse;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize zoom api response");
                            _logger.Debug($"URL={listAllRecordingsUrl} Token={token} Response={response.Content}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Zoom Api expected to return OK status code but returned other response");
                        _logger.Debug($"URL={listAllRecordingsUrl} Token={token} Response={response}");
                    }
                }
                catch(Exception ex)
                {
                    _logger.Error($"While getting list of recordings: {ex}");
                    _logger.Debug($"URL={listAllRecordingsUrl} Token={token}");
                }
            }

            return null;

        }

        public async Task<bool> DeleteWebinarAsync(string deleteWebinarUrl)
        {
            var token = this.GenerateToken(_tokenExpiration);
            if (token.HasValue())
            {
                try
                {
                    var client = new RestClient(deleteWebinarUrl);

                    var request = new RestRequest(Method.DELETE);

                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.NoContent)
                    {
                        return true;
                    }
                    else
                    {
                        _logger.Error($"Zoom Api expected to return NoContent status code but returned other response");
                        _logger.Debug($"URL={deleteWebinarUrl} Token={token} Response={response}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"While deleting webinar: {ex}");
                    _logger.Debug($"URL={deleteWebinarUrl} Token={token}");
                }
            }

            return false;

        }
    
        public async Task<ZoomWebinarDetailResponse> GetWebinarDetail(string webinarDetailUrl)
        {

            var token = this.GenerateToken(_tokenExpiration);
            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(webinarDetailUrl);

                    var request = new RestRequest(Method.GET);

                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        ZoomWebinarDetailResponse zoomWebinarDetailResponse = JsonConvert.DeserializeObject<ZoomWebinarDetailResponse>(response.Content);
                        if (zoomWebinarDetailResponse != null)
                        {
                            return zoomWebinarDetailResponse;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize zoom api response");
                            _logger.Debug($"URL={webinarDetailUrl} Token={token} Response={response.Content}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Zoom Api expected to return OK status code but returned other response");
                        _logger.Debug($"URL={webinarDetailUrl} Token={token} Response={response}");
                    }

                }
                catch (Exception ex)
                {
                    _logger.Error($"While getting webinar detail: {ex}");
                    _logger.Debug($"URL={webinarDetailUrl} Token={token}");

                }

            }

            return null;

        }

    }
}
