using System;

namespace MyTube.Services.Helpers.ZoomApi.Response.Domain
{
    public class ZoomUser
    {
        public string id { get; set; }

        public string first_name { get; set; }

        public string last_name { get; set; }

        public string email { get; set; }

        public int type { get; set; }

        public long pmi { get; set; }

        public string timezone { get; set; }

        public int verified { get; set; }

        public string dept { get; set; }

        public DateTime created_at { get; set; }

        public DateTime last_login_time { get; set; }

        public string last_client_version { get; set; }

        public string language { get; set; }

        public string phone_number { get; set; }

        public string status { get; set; }
    
    }

}
