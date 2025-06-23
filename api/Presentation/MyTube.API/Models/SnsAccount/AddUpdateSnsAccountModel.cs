namespace MyTube.API.Models.SnsAccount
{
    public class AddUpdateSnsAccountModel : BaseAuthorizedModel
    {

        public string Instagram { get; set; }

        public string Facebook { get; set; }

        public string Twitter { get; set; }

        public string Youtube { get; set; }

    }
}
