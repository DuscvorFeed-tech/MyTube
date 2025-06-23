using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Core.Helpers.Extensions;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Helpers.Token;
using MyTube.Services.Helpers.Url;

namespace MyTube.Services.Purchase
{
    public class PurchaseCouponService : IPurchaseCouponService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;
        private readonly IHttpContextAccessor _contextAccessor;

        #endregion

        #region Constructor

        public PurchaseCouponService(DataContext dataContext, IWeRaveYouLog logger,
                                                    IHttpContextAccessor contextAccessor)
        {
            _dataContext = dataContext;
            _logger = logger;
            _contextAccessor = contextAccessor;
        }

        #endregion

        public async Task<BaseResponse> InsertPurchaseCouponAsync(PurchaseCoupon entity)
        {
            try
            {

                await _dataContext.PurchaseCoupons.AddAsync(entity);

                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();

            }
            catch (Exception ex)
            {

                _logger.Error($"While trying to save record to purchase_coupon table: {ex}");
                _logger.Debug($"PurchaseId={entity.PurchaseId} CouponCode={entity.CouponCode} Active={entity.Active}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }
        }

        public long? GetPurchaseCouponCount(long purchaseId, string coupon)
        {
            long? count = null;

            try
            {

                count = _dataContext.PurchaseCoupons.AsNoTracking()
                            .Where(p =>
                                        p.PurchaseId == purchaseId &&
                                        p.CouponCode == coupon)
                            .LongCount();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from purchase_coupon table: {ex}");
                _logger.Debug($"WHERE PurchaseId={purchaseId} AND CouponCode={coupon}");
            }

            return count;
        }

        public int GetPurchaseCouponCount(long userId, string couponCode, bool active, DateTime? dateActivated, bool expired)
        {
            int count = 0;

            try
            {

                count = _dataContext.PurchaseCoupons.AsNoTracking()
                            .Include(e => e.Purchase)
                            .Where(p =>
                                        p.Purchase.UserId == userId &&
                                        p.CouponCode == couponCode &&
                                        p.Active == active &&
                                        p.DateActivated == dateActivated &&
                                        p.Expired == expired)
                            .Count();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record count from purchase_coupon table: {ex}");
                _logger.Debug($"WHERE CouponCode={couponCode} AND Active={active} AND DateActivated={dateActivated} AND Expired={expired} AND purchase.UserId={userId}");
            }

            return count;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="active"></param>
        /// <param name="whereCondition">
        /// 0 - UserId
        /// 1 - CouponCode
        /// 2 - Active
        /// 3 - DateActivated
        /// </param>
        /// <returns></returns>
        public async Task<BaseResponse> UpdatePurchaseCouponAsync(bool active, params object[] whereCondition)
        {

            BaseResponse response = null;

            try
            {

                var record = await _dataContext.PurchaseCoupons
                                        .Include(e => e.Purchase)
                                            .ThenInclude(e => e.Video)
                                        .Where(p =>
                                                    p.Purchase.UserId == (long)whereCondition[0] &&
                                                    p.CouponCode == (string)whereCondition[1] &&
                                                    p.Active == (bool)whereCondition[2] &&
                                                    p.DateActivated == (DateTime?)whereCondition[3])
                                        .FirstOrDefaultAsync();

                if(record != null)
                {

                    try
                    {
                        record.Active = active;
                        if(active == true)
                        {
                            record.Purchase.PurchaseStatusType = PurchaseStatusType.Active;
                            record.DateActivated = DateTime.Now;
                        }

                        _dataContext.PurchaseCoupons.Update(record);

                        await _dataContext.SaveChangesAsync();

                        var token = TokenHelper.GetToken(_contextAccessor.HttpContext);
                        var watchPaidUrl = UrlHelper.GetWatchPaidUrl(_contextAccessor.HttpContext);

                        if(token.HasValue() == false)
                        {
                            _logger.Error($"Failed getting token form HttpContext");
                        }
                        else if (watchPaidUrl.HasValue() == false)
                        {
                            _logger.Error($"Failed getting watch/paid URL form HttpContext");
                        }

                        string videoUrl = string.Format("{0}{1}/{2}/{3}", watchPaidUrl, record.CouponCode, record.Purchase.Video.PaidContentHash, token);

                        return new SuccessResponse(new { videoUrl = videoUrl });

                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update purchase_coupon record: {ex1}");
                        _logger.Debug($"Active={active} WHERE CouponCode={(string)whereCondition[1]} AND Active={(bool)whereCondition[2]} AND DateActivated={(DateTime?)whereCondition[3]} AND purchase.UserID={(long)whereCondition[0]}");
                        response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                    }

                }
                else
                {
                    _logger.Debug($"purchase_coupon record not found. Updating Active={active} failed using this condition: WHERE CouponCode={(string)whereCondition[1]} AND Active={(bool)whereCondition[2]} AND DateActivated={(DateTime?)whereCondition[3]} AND purchase.UserID={(long)whereCondition[0]}");
                    response = new ErrorResponse("CouponCode", MessageHelper.NoRecordFound, ErrorCodes.NoRecordFound);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase_coupon table: {ex}");
                _logger.Debug($"WHERE CouponCode={(string)whereCondition[1]} AND Active={(bool)whereCondition[2]} AND DateActivated={(DateTime?)whereCondition[3]} AND purchase.UserID={(long)whereCondition[0]}");
                response = new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

            return response;

        }

        public async Task<BaseResponse> UpdatePurchaseCouponAsync(int payPerViewCouponCodeValidity)
        {
            try
            {
                var purchaseCouponType = _dataContext.Model.FindEntityType(typeof(PurchaseCoupon));
                var purchaseCouponTableName = purchaseCouponType.GetTableName();

                var purchaseType = _dataContext.Model.FindEntityType(typeof(Core.Domain.Purchase.Purchase));
                var purchaseTableName = purchaseType.GetTableName();

                string sql = string.Format("SELECT `{0}`.* FROM `{0}` INNER JOIN `{1}` ON `{0}`.PurchaseId = `{1}`.Id WHERE `{1}`.PurchaseType = {2} AND `{0}`.DateActivated <= DATE_SUB(NOW(),INTERVAL {3} HOUR) AND `{0}`.Active=1 AND `{0}`.Expired=0;", purchaseCouponTableName, purchaseTableName, (int)PurchaseType.PayPerView, payPerViewCouponCodeValidity);

                try
                {

                    _dataContext.PurchaseCoupons
                                .FromSqlRaw(sql)
                                .ToList()
                                .ForEach(p =>
                                {
                                    p.Expired = true;
                                    p.Active = false;
                                });

                    await _dataContext.SaveChangesAsync();

                    return new SuccessResponse();

                }
                catch (Exception ex1)
                {
                    _logger.Error($"While trying to mark as expired (Expired=1 AND Active=0) all coupon codes activated more than {payPerViewCouponCodeValidity} hours: {ex1}");
                    _logger.Debug(sql);

                    return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying get OrderCoupon table name: {ex}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

    }
}
