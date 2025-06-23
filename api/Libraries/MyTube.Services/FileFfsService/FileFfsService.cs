using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.FileFfs;
using MyTube.Core.Domain.FileFfs.Enums;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.FileFfsService
{
    public class FileFfsService : IFileFfsService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public FileFfsService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public async Task<BaseResponse> InsertFileFfsAsync(FileFfs fileFfs)
        {

            try
            {
                await _dataContext.FileFfs.AddAsync(fileFfs);
                await _dataContext.SaveChangesAsync();
                return new SuccessResponse();
            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to save record to file_ffs table: {ex}");
                _logger.Debug($"File={fileFfs.File}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public async Task<List<FileFfs>> GetFileFfsListAsync(bool isProcessed)
        {

            List<FileFfs> records = null;

            try
            {

                if (isProcessed == false)
                {
                    records = await _dataContext.FileFfs.AsNoTracking()
                                            .Where(p =>
                                                        p.IsProcessed == isProcessed &&
                                                        p.UploadStatusType != UploadStatusType.Uploaded)
                                            .ToListAsync();
                }
                else
                {
                    records = await _dataContext.FileFfs.AsNoTracking()
                                            .Where(p =>
                                                        p.IsProcessed == isProcessed)
                                            .ToListAsync();
                }

                return records;

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get records from file_ffs table: {ex}");
                if(isProcessed == false)
                {
                    _logger.Debug($"WHERE IsProcessed={isProcessed} AND UploadStatusType !={UploadStatusType.Uploaded}");
                }
                else
                {
                    _logger.Debug($"WHERE IsProcessed={isProcessed}");
                }
            }

            return records;

        }

        public async Task<BaseResponse> UpdateFileFfsAsync(long id, bool isProcessed, UploadStatusType status)
        {



            try
            {

                var record = await _dataContext.FileFfs
                                    .Where(p =>
                                            p.Id == id)
                                    .SingleOrDefaultAsync();

                try
                {
                    record.DateProcessed = DateTime.Now;
                    
                    if (status == UploadStatusType.Uploaded)
                    {
                        record.IsProcessed = true;
                    }

                    record.UploadStatusType = status;
                    
                    _dataContext.FileFfs.Update(record);

                    await _dataContext.SaveChangesAsync();

                    return new SuccessResponse();

                }
                catch (Exception ex1)
                {
                    _logger.Error($"While trying to update file_ffs record: {ex1}");
                    _logger.Debug($"DateProcessed={record.DateProcessed},IsProcessed=true,UploadStatusType={status} WHERE Id={id} AND IsProcessed={isProcessed} AND UploadStatusType !={UploadStatusType.Uploaded}");
                    return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
                }

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from file_ffs table: {ex}");
                _logger.Debug($"WHERE Id={id}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

    }
}
