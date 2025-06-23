using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MyTube.Core.Domain.CommonType;
using MyTube.Services.Helpers.Responses;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Message;

namespace MyTube.Services.CommonType
{
    public class CommonTypeService : ICommonTypeService
    {

        #region Fields

        private readonly DataContext _dataContext;
        private readonly IWeRaveYouLog _logger;

        #endregion

        #region Constructor

        public CommonTypeService(DataContext dataContext, IWeRaveYouLog logger)
        {
            _dataContext = dataContext;
            _logger = logger;
        }

        #endregion

        public List<Core.Domain.CommonType.CommonType> GetCommonTypeList(CommonTypeList type)
        {

            List<Core.Domain.CommonType.CommonType> records = null;

            string strType = type.ToString();

            try
            {

                records = _dataContext.CommonTypes.AsNoTracking()
                                        .Where(p => 
                                                    p.Type == strType)
                                        .OrderBy(p => p.Sort)
                                        .ToList();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from common_type table: {ex}");
                _logger.Debug($"WHERE Type={strType}");
            }

            return records;

        }

        public async Task<object> GetCommonTypeListAsync(CommonTypeList type)
        {

            string strType = type.ToString();

            try
            {

                var records = await _dataContext.CommonTypes.AsNoTracking()
                                        .Where(p => 
                                                    p.Type == strType)
                                        .OrderBy(p => p.Sort)
                                        .Select(p => new
                                        {
                                            p.Name,
                                            p.NameEn,
                                            p.Value
                                        })
                                        .ToListAsync();

                return new SuccessResponse(records);

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from common_type table: {ex}");
                _logger.Debug($"WHERE Type={strType}");
                return new ErrorResponse("Database", MessageHelper.DatabaseError, ErrorCodes.DatabaseError);
            }

        }

        public long GetCommonTypeCount(CommonTypeList type, int value)
        {

            long count = 0;
            string strType = type.ToString();

            try
            {

                count = _dataContext.CommonTypes.AsNoTracking()
                                        .Where(p =>
                                                    p.Type == strType &&
                                                    p.Value == value)
                                        .LongCount();

            }
            catch (Exception ex)
            {
                _logger.Error($"While trying to get record from common_type table: {ex}");
                _logger.Debug($"WHERE Type={strType} AND Value={value}");
            }

            return count;

        }

        public string GetCommonTypeName(List<Core.Domain.CommonType.CommonType> list, int value, bool getJapaneseName)
        {

            string response = "";

            if (list != null && list.LongCount() > 0)
            {

                var record = list.Where(p => p.Value == value).SingleOrDefault();
                if (record != null)
                {
                    response = getJapaneseName == true ? record.Name : record.NameEn;
                }

            }

            return response;

        }

    }
}
