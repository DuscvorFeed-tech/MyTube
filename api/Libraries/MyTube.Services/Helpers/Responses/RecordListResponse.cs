using System;
using System.Collections.Generic;
using MyTube.Services.Helpers.Filter;

namespace MyTube.Services.Helpers.Responses
{
    public class RecordListResponse : BaseResponse
    {

        #region Constructor

        public RecordListResponse(int total)
        {
            base.Success = true;

            this.Total = total;
            this.Data = new List<object>();
            this.TotalPage = 1;
        }

        public RecordListResponse(long total, int recordDisplayPerPage)
        {
            base.Success = true;

            this.Total = total;

            if (total > 0 && (total <= recordDisplayPerPage))
            {
                this.TotalPage = 1;
            }
            else
            {

                var totalPageRaw = Convert.ToDecimal(total) / Convert.ToDecimal(recordDisplayPerPage);

                this.TotalPage = (long)totalPageRaw;

                if (totalPageRaw % 1 != 0)
                {
                    this.TotalPage++;
                }

            }

            this.Data = new List<object>();

        }

        #endregion

        public FilterHelper Filter { get; set; }

        public long Total { get; private set; }

        public long TotalPage { get; private set; }

        public List<object> Data { get; set; }

    }
}
