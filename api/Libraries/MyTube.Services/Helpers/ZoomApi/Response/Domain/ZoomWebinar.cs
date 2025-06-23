using System;

namespace MyTube.Services.Helpers.ZoomApi.Response.Domain
{
    public class ZoomWebinar
    {

        public string uuid { get; set; }

        public long id { get; set; }

        public string host_id { get; set; }

        public string host_email { get; set; }

        public string topic { get; set; }

        public int type { get; set; }

        public DateTime start_time { get; set; }

        public int duration { get; set; }

        public string timezone { get; set; }

        public string agenda { get; set; }

        public DateTime created_at { get; set; }

        public string start_url { get; set; }

        public string join_url { get; set; }

        public string password { get; set; }

        public ZoomSettings settings { get; set; }

    }

}
