using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Purchase.Enums;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;

namespace MyTube.Services.Sales
{
    public class SalesService : ISalesService
    {

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        public SalesService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<List<long>> GetUserIdListWithSalesAsync()
        {

            try
            {

                var records = await _dataContext.Users.AsNoTracking()
                                    .Include(e => e.Sales)
                                    .Where(p =>
                                                p.Sales.LongCount() > 0)
                                    .ToListAsync();

                return records.GroupBy(p => p.Id).Select(p => p.Key).ToList();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from user table: {ex}");
                _logger.Debug($"WHERE Sales (count) > 0");
            }

            return null;

        }

        public async Task<List<Core.Domain.Payout.PayoutItem>> GetSalesPurchaseListAsync(long userId, DateTime? dateFrom, DateTime? dateTo, PaymentStatusType paymentStatus, PurchaseType purchaseType)
        {

            try
            {

                if(purchaseType == PurchaseType.Subscription)
                {
                    return await _dataContext.PurchaseSubscriptions.AsNoTracking()
                            .Include(e => e.Purchase)
                                .ThenInclude(e => e.Sales)
                                    .ThenInclude(e => e.Artist)
                            .Include(e => e.Purchase)
                            .Where(p =>
                                        p.PaymentStatusType == paymentStatus &&
                                        p.Purchase.PurchaseType == purchaseType &&
                                        p.Purchase.Sales.UserId == userId &&
                                        p.Purchase.DateCreated >= dateFrom &&
                                        p.Purchase.DateCreated <= dateTo)
                            .Select(p => new Core.Domain.Payout.PayoutItem
                            {
                                PurchaseSubscriptionId = p.Id,
                                Amount = Convert.ToDouble(p.NetAmount)
                            })
                            .ToListAsync();
                }

                return await _dataContext.Purchases.AsNoTracking()
                        .Include(e => e.Sales)
                            .ThenInclude(e => e.Artist)
                                .ThenInclude(e => e.ProfitPercentage)
                        .Include(e => e.Detail)
                        .Where(p =>
                                    p.PurchaseType == purchaseType &&
                                    p.PaymentStatusType == paymentStatus &&
                                    p.DateCreated >= dateFrom &&
                                    p.DateCreated <= dateTo &&
                                    p.Sales.UserId == userId)
                        .Select(p => new Core.Domain.Payout.PayoutItem
                        {
                            PurchaseId = p.Id,
                            Amount = Convert.ToDouble(p.Detail.NetAmount)
                        })
                        .ToListAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from purchase table: {ex}");
                _logger.Debug($"WHERE PurchaseType={(int)purchaseType} AND PurchaseType={(int)paymentStatus} AND sales.UserId={userId}");
            }

            return null;

        }

    }
}
