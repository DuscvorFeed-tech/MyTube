using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.CommonType;

namespace MyTube.Services.CommonType
{

    public interface ICommonTypeService
    {

        List<Core.Domain.CommonType.CommonType> GetCommonTypeList(CommonTypeList type);

        Task<object> GetCommonTypeListAsync(CommonTypeList type);

        long GetCommonTypeCount(CommonTypeList type, int value);

        string GetCommonTypeName(List<Core.Domain.CommonType.CommonType> list, int value, bool getJapaneseName);

    }

}
