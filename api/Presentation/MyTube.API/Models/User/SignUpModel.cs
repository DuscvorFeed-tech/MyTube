using MyTube.Core.Domain.User.Enums;

namespace MyTube.API.Models.User
{
    public class SignUpModel
    {

        public string Username { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string ConfirmPassword { get; set; }

        public UserType? UserType { get; set; }

        public bool SecuredFileTransfer { get; set; }

        public bool Agree { get; set; }

        public int LocaleType { get; set; }

    }
}
