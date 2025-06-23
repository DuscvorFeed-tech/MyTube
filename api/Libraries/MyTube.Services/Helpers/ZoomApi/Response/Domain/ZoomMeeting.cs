using System;

namespace MyTube.Services.Helpers.ZoomApi.Response.Domain
{
    public class ZoomMeeting
    {
        public string uuid { get; set; }

        public long id { get; set; }

        public string account_id { get; set; }

        public string host_id { get; set; }

        public string topic { get; set; }

        public int type { get; set; }

        public string start_time { get; set; }

        public string timezone { get; set; }

        public int duration { get; set; }

        public int total_size { get; set; }

        public int recording_count { get; set; }

        public string share_url { get; set; }

        public ZoomRecording_Files[] recording_files { get; set; }
    }

}
