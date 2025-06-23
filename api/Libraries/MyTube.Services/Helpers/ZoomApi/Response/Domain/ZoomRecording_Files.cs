using System;

namespace MyTube.Services.Helpers.ZoomApi.Response.Domain
{

    public class ZoomRecording_Files
    {

        public string id { get; set; }

        public string meeting_id { get; set; }

        public string recording_start { get; set; }

        public string recording_end { get; set; }

        public string file_type { get; set; }

        public int file_size { get; set; }

        public string play_url { get; set; }

        public string download_url { get; set; }

        public string status { get; set; }

        public string recording_type { get; set; }

    }

}
