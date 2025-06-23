namespace MyTube.API.Models.Password
{
    public class ResetPasswordModel
    {

        public string Key { get; set; }

        public string ResetCode { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }


    }

}
