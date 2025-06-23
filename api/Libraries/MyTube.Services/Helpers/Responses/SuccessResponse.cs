namespace MyTube.Services.Helpers.Responses
{
    public class SuccessResponse : BaseResponse
    {

        #region Properties

        public object Data { get; private set; }

        #endregion

        #region Constructors

        public SuccessResponse()
        {
            base.Success = true;
        }

        public SuccessResponse(object data)
        {
            this.Data = data;
            base.Success = true;
        }

        #endregion

    }
}
