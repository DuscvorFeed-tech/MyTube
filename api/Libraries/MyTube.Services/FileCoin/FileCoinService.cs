using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.Helpers.FileCoin;
using MyTube.Services.Helpers.FileCoin.Response;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.FileCoin
{
    public class FileCoinService : IFileCoinService
    {
        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly IHttpContextAccessor _contextAccessor;

        public FileCoinService(DataContext dataContext, IWeRaveYouLog logger,
                                IHttpContextAccessor contextAccessor)
        {
            _dataContext = dataContext;
            _logger = logger;
            _contextAccessor = contextAccessor;
        }

        public async Task<BaseResponse> InsertPurchaseAsync(PurchaseType purchaseType, string paidContentHash)
        {

            var user = (Core.Domain.User.User)this._contextAccessor.HttpContext.Items["User"];
            if(user == null)
            {
                _logger.Debug($"Cannot get user information from HttpContext: {_contextAccessor}");
                return new ErrorResponse("User", MessageHelper.Error401, ErrorCodes.Error401);
            }


            try
            {

                long videoId = 0;
                long webinarId = 0;
                double? filPrice = 0;

                if (purchaseType == PurchaseType.PayPerView)
                {
                    var video = await _dataContext.Videos.AsNoTracking()
                                            .Where(p =>
                                                        p.UserId != user.Id &&
                                                        p.PaidContent == true &&
                                                        p.PaidContentHash == paidContentHash)
                                            .SingleOrDefaultAsync();

                    if (video == null)
                    {
                        return new ErrorResponse("PaidContentHash", MessageHelper.Invalid, ErrorCodes.Invalid);
                    }

                    videoId = video.Id;
                    filPrice = video.PaidContentFilPrice;
                }
                else
                {
                    var webinar = await _dataContext.Webinars.AsNoTracking()
                                            .Where(p =>
                                                        p.CreatedBy != user.Id &&
                                                        p.LiveTicket == true &&
                                                        p.LiveTicketHash == paidContentHash)
                                            .SingleOrDefaultAsync();

                    if (webinar == null)
                    {
                        return new ErrorResponse("PaidContentHash", MessageHelper.Invalid, ErrorCodes.Invalid);
                    }

                    webinarId = webinar.Id;
                    filPrice = webinar.LiveTicketFilPrice;

                }


                #region Gateway

                var filecoinHelper = new FileCoinHelper(_logger);

                var walletCreateResponse = await filecoinHelper.WalletCreateAsync("https://gw-stg.ipfssys.info/wallet/create");
                if(walletCreateResponse == null)
                {
                    return new ErrorResponse("WalletAddress", MessageHelper.FilPaymentGateway_WalletCreateResponseNull, ErrorCodes.FilPaymentGateway_WalletCreateResponseNull);
                }

                if(walletCreateResponse.StatusCode != System.Net.HttpStatusCode.OK)
                {
                    return new ErrorResponse("WalletAddress", MessageHelper.FilPaymentGateway_WalletCreateResponseNotRecognized, ErrorCodes.FilPaymentGateway_WalletCreateResponseNotRecognized);
                }

                WalletCreateResponse convertedResp = JsonConvert.DeserializeObject<WalletCreateResponse>(walletCreateResponse.Content);
                if(convertedResp == null)
                {
                    return new ErrorResponse("WalletAddress", MessageHelper.FilPaymentGateway_WalletCreateResponseNotRecognized, ErrorCodes.FilPaymentGateway_WalletCreateResponseNotRecognized);
                }

                if(convertedResp.WalletAddress.HasValue() == false)
                {
                    return new ErrorResponse("WalletAddress", MessageHelper.FilPaymentGateway_WalletCreateResponseWalletAddressIsNull, ErrorCodes.FilPaymentGateway_WalletCreateResponseWalletAddressIsNull);
                }

                if (convertedResp.WalletInfo == null)
                {
                    return new ErrorResponse("WalletAddress", MessageHelper.FilPaymentGateway_WalletCreateResponsePrivateKeyIsNull, ErrorCodes.FilPaymentGateway_WalletCreateResponsePrivateKeyIsNull);
                }
                else
                {
                    if(convertedResp.WalletInfo.PrivateKey.HasValue() == false)
                    {
                        return new ErrorResponse("WalletAddress", MessageHelper.FilPaymentGateway_WalletCreateResponsePrivateKeyIsNull, ErrorCodes.FilPaymentGateway_WalletCreateResponsePrivateKeyIsNull);
                    }
                }                    

                string walletAddress = convertedResp.WalletAddress;
                string privateKey = convertedResp.WalletInfo.PrivateKey;

                #endregion

                var purchase = new Core.Domain.Purchase.Purchase
                {
                    UserId = user.Id,
                    PurchaseType = purchaseType,
                    PaymentType = PaymentType.Fil,
                    PurchaseStatusType = PurchaseStatusType.WaitingForPayment,
                    Active = true,
                    SubscriptionEmailStatusType = SubscriptionEmailStatusType.None,
                    Detail = new Core.Domain.Purchase.PurchaseDetail
                    {
                        Ref_OrderId = "",
                        WalletAddress = walletAddress,
                        PrivateKey = privateKey,
                        Ref_GrossAmount = filPrice
                    }
                };

                if(purchaseType == PurchaseType.PayPerView)
                {
                    purchase.VideoId = videoId;
                }
                else
                {
                    purchase.WebinarId = webinarId;
                }

                using (var transaction = _dataContext.Database.BeginTransaction())
                {
                    try
                    {
                        await _dataContext.Purchases.AddAsync(purchase);
                        await _dataContext.SaveChangesAsync();

                        await transaction.CommitAsync();

                        return new SuccessResponse(new { WalletAddress = walletAddress });

                    }
                    catch (Exception ex1)
                    {
                        await transaction.RollbackAsync();

                        _logger.Debug($"Failed saving record to purchase table: {ex1}");
                        return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from video table: {ex}");
                _logger.Debug($"WHERE UserId != {user.Id} AND PaidContent=1 AND PaidContentHash={paidContentHash}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

    }
}
