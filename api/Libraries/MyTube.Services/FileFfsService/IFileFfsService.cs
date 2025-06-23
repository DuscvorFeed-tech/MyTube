using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.FileFfs;
using MyTube.Core.Domain.FileFfs.Enums;
using MyTube.Services.Helpers.Responses;

namespace MyTube.Services.FileFfsService
{
    public interface IFileFfsService
    {

        Task<BaseResponse> InsertFileFfsAsync(FileFfs fileFfs);

        Task<List<FileFfs>> GetFileFfsListAsync(bool isProcessed);

        Task<BaseResponse> UpdateFileFfsAsync(long id, bool isProcessed, UploadStatusType status);


    }
}
