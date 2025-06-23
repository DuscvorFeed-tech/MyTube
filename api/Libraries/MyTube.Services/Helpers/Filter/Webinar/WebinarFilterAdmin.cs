using System;

namespace MyTube.Services.Helpers.Filter.Webinar
{
    public class WebinarFilterAdmin : FilterHelperAdmin
    {

        public string Username { get; set; }

        public string Email { get; set; }

        public long? UserId { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

    }
}
