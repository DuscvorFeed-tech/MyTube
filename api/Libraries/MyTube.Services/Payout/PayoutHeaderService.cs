using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.Payout;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.Payout
{
    public class PayoutHeaderService : IPayoutHeaderService
    {

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        public PayoutHeaderService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        public async Task<BaseResponse> InsertPayoutHeaderAsync(PayoutHeader header)
        {

            try
            {

                await _dataContext.PayoutHeaders.AddAsync(header);

                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to payout_header table: {ex}");
                _logger.Debug($"payout_header={header}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public async Task<List<PayoutHeader>> GetPayoutHeaderListAsync(bool sentToPaypal, bool asNoTracking = true)
        {

            try
            {

                if(sentToPaypal == false)
                {
                    if(asNoTracking == false)
                    {

                        return await _dataContext.PayoutHeaders.AsNoTracking()
                                                            .Include(e => e.Artists)
                                                                .ThenInclude(e => e.Items)
                                                            .Include(e => e.Artists)
                                                                .ThenInclude(e => e.User)
                                                            .Where(p =>
                                                                        p.SentToPaypal == sentToPaypal &&
                                                                        p.DateSent == null)
                                                            .ToListAsync();

                    }

                    return await _dataContext.PayoutHeaders
                                    .Include(e => e.Artists)
                                        .ThenInclude(e => e.Items)
                                    .Include(e => e.Artists)
                                        .ThenInclude(e => e.User)
                                    .Where(p =>
                                                p.SentToPaypal == sentToPaypal &&
                                                p.DateSent == null)
                                    .ToListAsync();
                }

                if(asNoTracking == false)
                {
                    return await _dataContext.PayoutHeaders
                                        .Include(e => e.Artists)
                                            .ThenInclude(e => e.Items)
                                        .Include(e => e.Artists)
                                            .ThenInclude(e => e.User)
                                        .Where(p =>
                                                    p.SentToPaypal == sentToPaypal &&
                                                    p.DateSent != null)
                                        .ToListAsync();
                }

                return await _dataContext.PayoutHeaders.AsNoTracking()
                    .Include(e => e.Artists)
                        .ThenInclude(e => e.Items)
                    .Include(e => e.Artists)
                        .ThenInclude(e => e.User)
                    .Where(p =>
                                p.SentToPaypal == sentToPaypal &&
                                p.DateSent != null)
                    .ToListAsync();


            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from payout_header table: {ex}");
                if(sentToPaypal == false)
                {
                    _logger.Debug($"WHERE SentToPaypal={sentToPaypal} AND DateSent IS NULL");
                }
                else
                {
                    _logger.Debug($"WHERE SentToPaypal={sentToPaypal} AND DateSent IS NOT NULL");
                }

                return null;
            }

        }

        public async Task<List<PayoutArtist>> GetPayoutArtistListAsync(List<long> payoutArtistIds)
        {
            try
            {

                return await _dataContext.PayoutArtists.AsNoTracking()
                                    .Include(e => e.Items)
                                    .Where(p =>
                                                payoutArtistIds.Contains(p.Id))
                                    .ToListAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to payout_artist table: {ex}");
                _logger.Debug($"WHERE Id IN ({payoutArtistIds})");
            }

            return null;

        }

        public async Task<List<PayoutItem>> GetPayoutItemListAsync(List<long> payoutItemIds, Core.Domain.Purchase.Enums.PurchaseType purchaseType, bool asNoTracking = true)
        {

            try
            {

                if(purchaseType == Core.Domain.Purchase.Enums.PurchaseType.Subscription)
                {
                    if(asNoTracking == true)
                    {

                        return await _dataContext.PayoutItems.AsNoTracking()
                                            .Include(e => e.Subscription)
                                            .Where(p =>
                                                        payoutItemIds.Contains(p.Id))
                                            .ToListAsync();

                    }

                    return await _dataContext.PayoutItems
                                        .Include(e => e.Subscription)
                                        .Where(p =>
                                                    payoutItemIds.Contains(p.Id))
                                        .ToListAsync();

                }

                if(asNoTracking == true)
                {
                    return await _dataContext.PayoutItems.AsNoTracking()
                                        .Include(e => e.Purchase)
                                        .Where(p =>
                                                    payoutItemIds.Contains(p.Id))
                                        .ToListAsync();
                }

                return await _dataContext.PayoutItems
                                    .Include(e => e.Purchase)
                                    .Where(p =>
                                                payoutItemIds.Contains(p.Id))
                                    .ToListAsync();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to payout_item table: {ex}");
                _logger.Debug($"WHERE Id IN ({payoutItemIds})");
            }

            return null;

        }


        public async Task<BaseResponse> UpdatePayoutHeaderAsync(long id, bool sentToPaypal, string payoutBatchId)
        {

            try
            {

                var record = await _dataContext.PayoutHeaders
                                        .Where(p =>
                                                    p.Id == id)
                                        .SingleOrDefaultAsync();

                if(record != null)
                {

                    try
                    {
                        record.SentToPaypal = sentToPaypal;
                        record.DateSent = DateTime.Now;
                        record.PayoutBatchId = payoutBatchId;

                        _dataContext.PayoutHeaders.Update(record);

                        await _dataContext.SaveChangesAsync();

                        return new SuccessResponse();

                    }
                    catch (Exception ex1)
                    {
                        _logger.Error($"While trying to update payout_header record: {ex1}");
                        _logger.Debug($"SentToPaypal={record.SentToPaypal},DateSent={record.DateSent},PayoutBatchId={payoutBatchId} WHERE Id={id}");
                    }

                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from payout_header table: {ex}");
                _logger.Debug($"WHERE Id={id}");
            }

            return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);

        }

        public async Task<BaseResponse> UpdatePayoutHeaderAsync(PayoutHeader header)
        {

            try
            {
                _dataContext.PayoutHeaders.Update(header);

                await _dataContext.SaveChangesAsync();

                return new SuccessResponse();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update payout_header record: {ex}");
                _logger.Debug($"WHERE Id={header.Id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }


        public async Task<BaseResponse> UpdatePayoutItemAsync(List<PayoutItem> payoutItemList)
        {

            try
            {

                _dataContext.PayoutItems.UpdateRange(payoutItemList);
                await _dataContext.SaveChangesAsync();
                return new SuccessResponse();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to update payout_item record: {ex}");
                _logger.Debug($"WHERE");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

    }
}
