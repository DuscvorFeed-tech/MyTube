using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Net;
using System.Threading.Tasks;
using MyTube.Core.Domain.Caches;
using MyTube.Core.Helpers.Extensions;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Paypal.Domain;
using MyTube.Services.Helpers.Paypal.Request;
using MyTube.Services.Helpers.Paypal.Response;
using MyTube.Services.Helpers.Settings;

namespace MyTube.Services.Helpers.Paypal
{
    public class PaypalApiHelper
    {

        private readonly IWeRaveYouLog _logger;
        private readonly string _clientId;
        private readonly string _secret;

        private const int forAllAllowance = 5;

        public PaypalApiHelper(IWeRaveYouLog logger, string clientId, string secret)
        {
            _logger = logger;
            _clientId = clientId;
            _secret = secret;
        }

        public async Task<PaypalGenerateAccessTokenResponse> GenerateAccessTokenAsync(string generateTokenUrl)
        {

            try
            {

                var client = new RestClient(generateTokenUrl);
                client.Authenticator = new HttpBasicAuthenticator(_clientId, _secret);
                var request = new RestRequest(Method.POST);

                request.AddHeader("content-type", "application/json");
                request.AddParameter("application/x-www-form-urlencoded", "grant_type=client_credentials", ParameterType.RequestBody);

                IRestResponse response = await client.ExecuteAsync(request);
                if (response.StatusCode == HttpStatusCode.OK)
                {
                    PaypalGenerateTokenResponse generateTokenResponse = JsonConvert.DeserializeObject<PaypalGenerateTokenResponse>(response.Content);
                    if (generateTokenResponse != null)
                    {
                        var currentDateTime = DateTime.Now;
                        var ts = new TimeSpan(0, 0, generateTokenResponse.expires_in);

                        var expiredAt = currentDateTime.Add(ts);

                        return new PaypalGenerateAccessTokenResponse()
                        {
                            AccessToken = generateTokenResponse.access_token,
                            ExpiresIn = expiredAt.ToString("yyyy-MM-dd HH:mm:ss")
                        };
                    }
                    else
                    {
                        _logger.Error($"Cannot deserialize Paypal API generate token response");
                        _logger.Debug($"URL={generateTokenUrl} Client ID={_clientId} Secret={_secret} Response={response.Content}");
                    }
                }
                else
                {
                    _logger.Error($"Paypal API expected to return OK status code but returned other response");
                    _logger.Debug($"URL={generateTokenUrl} Client ID={_clientId} Secret={_secret}");
                }
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to generate Token: {ex}");
                _logger.Debug($"Url={generateTokenUrl} Client ID={_clientId} Secret={_secret}");
            }

            return null;

        }

        public async Task<PaypalCreateOrderResponse> CreateOrderAsync(string token, string createOrderUrl, string returnUrl, string cancelUrl, string amount, string currency)
        {

            if(token.HasValue())
            {

                try
                {

                    var client = new RestClient(createOrderUrl);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    var order = new PaypalOrder
                    {
                        intent = "AUTHORIZE",
                        application_context = new PaypalApplicationContext
                        {
                            landing_page = "BILLING",
                            user_action = "CONTINUE",
                            cancel_url = cancelUrl,
                            return_url = returnUrl,
                        },
                        purchase_units = new PaypalOrderPurchaseUnits[]
                        {
                            new PaypalOrderPurchaseUnits
                            {
                                amount = new PaypalAmount
                                {
                                    currency_code = currency,
                                    value = amount
                                }
                            }
                        }
                    };

                    request.AddParameter("application/json", JsonConvert.SerializeObject(order), ParameterType.RequestBody);
                    IRestResponse response = await client.ExecuteAsync(request);
                    if(response.StatusCode == HttpStatusCode.Created)
                    {
                        PaypalCreateOrderResponse createOrderResponse = JsonConvert.DeserializeObject<PaypalCreateOrderResponse>(response.Content);
                        if (createOrderResponse != null)
                        {
                            return createOrderResponse;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize Paypal Create Order API response");
                            _logger.Debug($"Token={token} URL={createOrderUrl} CancelURL={cancelUrl} ReturnURL={returnUrl} Amount={amount} Currency={currency} Response={response.Content}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return Created status code but returned other response");
                        _logger.Debug($"Token={token} URL={createOrderUrl} CancelURL={cancelUrl} ReturnURL={returnUrl} Amount={amount} Currency={currency}");
                    }


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to create Paypal's Order: {ex}");
                    _logger.Debug($"Token={token} URL={createOrderUrl} CancelURL={cancelUrl} ReturnURL={returnUrl} Amount={amount} Currency={currency}");
                }

            }

            return null;

        }

        public async Task<IRestResponse> GetPaymentPayoutDetailsAsync(string token, string paymentPayoutUrl, string payoutBatchId)
        {

            string url = string.Format("{0}/{1}", paymentPayoutUrl, payoutBatchId);

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(url);
                    var request = new RestRequest(Method.GET);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);

                    return response;

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to create Paypal's Payment Payout: {ex}");
                    _logger.Debug($"Token={token} URL={url}");
                }

            }

            return null;

        }

        public async Task<IRestResponse> SendPaymentPayoutAsync(string token, string paymentPayoutUrl, PaypalPayout payout)
        {

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(paymentPayoutUrl);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    request.AddParameter("application/json", JsonConvert.SerializeObject(payout), ParameterType.RequestBody);
                    IRestResponse response = await client.ExecuteAsync(request);

                    return response;

                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to create Paypal's Payment Payout: {ex}");
                    _logger.Debug($"Token={token} URL={paymentPayoutUrl} Payout={payout}");
                }

            }

            return null;

        }

        public async Task<PaypalSubscriptionTransactionListResponse> GetSubscriptionTransactionList(string token, string subscriptionTransactionListUrl, string subscriptionId, string startTime, string endTime)
        {
            string url = string.Format(subscriptionTransactionListUrl, subscriptionId, startTime, endTime);

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(url);
                    var request = new RestRequest(Method.GET);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        PaypalSubscriptionTransactionListResponse resp = JsonConvert.DeserializeObject<PaypalSubscriptionTransactionListResponse>(response.Content);
                        if (resp != null)
                        {
                            if (resp.transactions != null && resp.transactions.Length > 0)
                            {
                                return resp;
                            }
                            else
                            {
                                _logger.Error($"Transactions expected not to be null: {response.Content}");
                                _logger.Debug($"Token={token} URL={url}");
                            }
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize Paypal Subscription Transaction List API response: {response.Content}");
                            _logger.Debug($"Token={token} URL={url}");
                        }
                    }
                    else if(response.StatusCode == HttpStatusCode.BadRequest)
                    { }
                    else
                    {
                        _logger.Error($"Paypal API expected to return OK status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL={url}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to authorize get Paypal's Subscription Transaction List: {ex}");
                    _logger.Debug($"Token={token} URL={url}");
                }

            }

            return null;

        }

        public async Task<PaypalCreateBillingPlansResponse> CreateBillingPlanAysnc(string token, string billingPlansUrl, PaypalSettings_v2 paypalSettings, string artistName, string amount)
        {

            string url = billingPlansUrl;

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(url);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    var plan = new PaypalPlan
                    {
                        product_id = paypalSettings.ProductId,
                        name = string.Format(paypalSettings.PlanName, artistName),
                        description = paypalSettings.ProductDescription,
                        status = "ACTIVE",
                        billing_cycles = new PaypalBillingCycle[]
                        {
                            new PaypalBillingCycle
                            {
                                frequency = new PaypalFrequency
                                {
                                    interval_unit = "MONTH",
                                    interval_count = "1"
                                },
                                tenure_type = "REGULAR",
                                sequence = 1,
                                total_cycles = 0,
                                pricing_scheme = new PaypalPricingScheme
                                {
                                    fixed_price = new PaypalAmount
                                    {
                                        currency_code = paypalSettings.Currency,
                                        value = amount
                                    }
                                }

                            }
                        },
                        payment_preferences = new PaypalPaymentPreferences
                        {
                            setup_fee_failure_action = "CONTINUE",
                            payment_failure_threshold = 3
                        }

                    };

                    request.AddParameter("application/json", JsonConvert.SerializeObject(plan), ParameterType.RequestBody);
                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.Created)
                    {
                        PaypalCreateBillingPlansResponse resp = JsonConvert.DeserializeObject<PaypalCreateBillingPlansResponse>(response.Content);
                        if (resp != null)
                        {
                            return resp;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize Paypal Billing Plan API response: {response.Content}");
                            _logger.Debug($"Token={token} URL ={url}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return Created status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL ={url}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to create Paypal's billing plan: {ex}");
                    _logger.Debug($"Token={token} URL={url}");
                }

            }

            return null;

        }

        public async Task<bool> CreateCatalogProductAsync(string token, string catalogsProductsUrl, PaypalSettings_v2 paypalSettings)
        {

            string url = catalogsProductsUrl;

            if (token.HasValue())
            {
                try
                {
                    var client = new RestClient(url);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    var product = new
                    {
                        id = paypalSettings.ProductId,
                        name = paypalSettings.ProductName,
                        description = paypalSettings.ProductDescription,
                        type = paypalSettings.ProductType
                    };

                    request.AddParameter("application/json", JsonConvert.SerializeObject(product), ParameterType.RequestBody);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.Created)
                    {
                        return true;
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return Created status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL ={url}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to create Catalog Product on Paypal: {ex}");
                    _logger.Debug($"Token={token} URL={url} id={paypalSettings.ProductId} name={paypalSettings.ProductName} description={paypalSettings.ProductDescription} type={paypalSettings.ProductType}");
                }
            }

            return false;

        }

        public async Task<bool> GetCatalogProductAsync(string token, string catalogsProductsUrl, string productId)
        {
            string url = string.Format("{0}/{1}", catalogsProductsUrl, productId);

            if (token.HasValue())
            {

                try
                {
                    var client = new RestClient(url);
                    var request = new RestRequest(Method.GET);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        return true;
                    }
                    else if(response.StatusCode == HttpStatusCode.NotFound)
                    {
                        return false;
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return OK or NotFound status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL ={url}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to check if Product Id exist on Paypal: {ex}");
                    _logger.Debug($"Token={token} URL ={url}");
                }

            }

            return false;
        }

        public async Task<PaypalAuthorizeOrderPaymentResponse> AuthorizeOrderPaymentAsync(string token, string authorizeOrderPaymentUrl, string orderId)
        {

            string url = string.Format(authorizeOrderPaymentUrl, orderId);

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(url);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.Created)
                    {
                        PaypalAuthorizeOrderPaymentResponse authorizeOrderPaymentResponse = JsonConvert.DeserializeObject<PaypalAuthorizeOrderPaymentResponse>(response.Content);
                        if (authorizeOrderPaymentResponse != null)
                        {
                            return authorizeOrderPaymentResponse;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize Paypal Authorize Order Payment API response: {response.Content}");
                            _logger.Debug($"Token={token} URL ={url}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return Created status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL ={url}");
                    }


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to authorize Paypal's order payment: {ex}");
                    _logger.Debug($"Token={token} URL ={url}");
                }

            }

            return null;

        }

        public async Task<PaypalCaptureOrderPaymentResponse> CaptureOrderPaymentAsync(string token, string authorizeOrderPaymentUrl, string paymentAuthorizationId)
        {

            string url = string.Format(authorizeOrderPaymentUrl, paymentAuthorizationId);

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(url);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.Created)
                    {
                        PaypalCaptureOrderPaymentResponse captureOrderPaymentResponse = JsonConvert.DeserializeObject<PaypalCaptureOrderPaymentResponse>(response.Content);
                        if (captureOrderPaymentResponse != null)
                        {
                            return captureOrderPaymentResponse;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize Paypal Capture Order Payment API response: {response.Content}");
                            _logger.Debug($"Token={token} URL ={url}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return Created status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL ={url}");
                    }


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to capture Paypal's order payment: {ex}");
                    _logger.Debug($"Token={token} URL ={url}");
                }

            }

            return null;
        }

        public async Task<PaypalCreateSubscriptionResponse> CreateSubscriptionAsync(string token, string createSubscriptionUrl, string planId, string emailAddress, string returnUrl, string cancelUrl)
        {

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(createSubscriptionUrl);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    var subscription = new PaypalSubscription
                    {
                        plan_id = planId,
                        start_time = DateTime.Now.AddHours(1).ToString("yyyy-MM-ddTHH:00:00Z"),
                        quantity = "1",
                        subscriber = new PaypalSubscriber
                        {
                            email_address = emailAddress
                        },
                        application_context = new PaypalApplicationContext
                        {
                            user_action = "SUBSCRIBE_NOW",
                            cancel_url = cancelUrl,
                            return_url = returnUrl,
                            payment_method = new PaypalPaymentMethod
                            {
                                payer_selected = "PAYPAL",
                                payee_preferred = "IMMEDIATE_PAYMENT_REQUIRED"
                            }
                        }
                    };

                    request.AddParameter("application/json", JsonConvert.SerializeObject(subscription), ParameterType.RequestBody);
                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.Created)
                    {
                        PaypalCreateSubscriptionResponse createSubscriptionResponse = JsonConvert.DeserializeObject<PaypalCreateSubscriptionResponse>(response.Content);
                        if (createSubscriptionResponse != null)
                        {
                            return createSubscriptionResponse;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize Paypal Create Subscription API response");
                            _logger.Debug($"Token={token} URL={createSubscriptionUrl} CancelURL={cancelUrl} ReturnURL={returnUrl} PlanId={planId} EmailAddress={emailAddress} Response={response.Content}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return Created status code but returned other response");
                        _logger.Debug($"Token={token} URL={createSubscriptionUrl} CancelURL={cancelUrl} ReturnURL={returnUrl} PlanId={planId} EmailAddress={emailAddress}");
                    }


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to create Paypal's Subscription: {ex}");
                    _logger.Debug($"Token={token} URL={createSubscriptionUrl} CancelURL={cancelUrl} ReturnURL={returnUrl} PlanId={planId} EmailAddress={emailAddress}");
                }

            }

            return null;

        }

        public async Task<PaypalGetSubscriptionDetailsResponse> GetSubscriptionDetails(string token, string subscriptionDetailsUrl, string subscriptionId)
        {
            string url = string.Format(subscriptionDetailsUrl, subscriptionId);

            if (token.HasValue())
            {

                try
                {
                    var client = new RestClient(url);
                    var request = new RestRequest(Method.GET);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        PaypalGetSubscriptionDetailsResponse subscriptionDetailsResponse = JsonConvert.DeserializeObject<PaypalGetSubscriptionDetailsResponse>(response.Content);
                        if (subscriptionDetailsResponse != null)
                        {
                            return subscriptionDetailsResponse;
                        }
                        else
                        {
                            _logger.Error($"Cannot deserialize Paypal Get Subscription Details API response");
                            _logger.Debug($"Token={token} URL={subscriptionDetailsUrl}");
                        }
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return OK status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL ={url}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to get Paypal's subscription details: {ex}");
                    _logger.Debug($"Token={token} URL ={url}");
                }

            }

            return null;
        }

        public async Task<bool> VoidOrderPaymentAsync(string token, string voidOrderPaymentUrl, string authorizationId)
        {

            string url = string.Format(voidOrderPaymentUrl, authorizationId);

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(url);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.OK)
                    {
                        return true;
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return OK status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL ={url}");
                    }


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to void Paypal's order payment: {ex}");
                    _logger.Debug($"Token={token} URL ={url}");
                }

            }

            return false;

        }

        public async Task<bool> CancelSubscriptionAsync(string token, string subscriptionCancelUrl, string ref_SubscriptionId)
        {
            string url = string.Format(subscriptionCancelUrl, ref_SubscriptionId);

            if (token.HasValue())
            {

                try
                {

                    var client = new RestClient(url);
                    var request = new RestRequest(Method.POST);

                    request.AddHeader("prefer", "return=representation");
                    request.AddHeader("content-type", "application/json");
                    request.AddHeader("authorization", "Bearer " + token);

                    request.AddParameter("application/json", JsonConvert.SerializeObject(new { reason="Cancel WRY artist subscription" }), ParameterType.RequestBody);

                    IRestResponse response = await client.ExecuteAsync(request);
                    if (response.StatusCode == HttpStatusCode.NoContent)
                    {
                        return true;
                    }
                    else
                    {
                        _logger.Error($"Paypal API expected to return NoContent status code but returned other response: {response.Content}");
                        _logger.Debug($"Token={token} URL ={url}");
                    }


                }
                catch (Exception ex)
                {
                    _logger.Error($"While trying to cancel Paypal's subscription: {ex}");
                    _logger.Debug($"Token={token} URL ={url}");
                }

            }

            return false;

        }

        public static bool IsPaypalAccessTokenValid(Cache cache, IWeRaveYouLog logger)
        {
            if (cache != null)
            {
                var tokenExpiresAt = PaypalAccessTokenExpiresAt(cache.Value2, logger);
                if (tokenExpiresAt.HasValue)
                {
                    if (tokenExpiresAt <= DateTime.Now.AddMinutes(forAllAllowance))
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
            }

            return false;

        }

        private static DateTime? PaypalAccessTokenExpiresAt(string value2, IWeRaveYouLog logger)
        {
            try
            {
                return Convert.ToDateTime(value2);
            }
            catch (Exception ex)
            {
                logger.Error($"While trying to convert cache.Value2={value2} to DateTime: {ex}");
                return null;
            }
        }

    }
}
