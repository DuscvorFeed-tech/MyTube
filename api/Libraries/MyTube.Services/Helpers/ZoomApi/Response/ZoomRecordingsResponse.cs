using MyTube.Services.Helpers.ZoomApi.Response.Domain;

namespace MyTube.Services.Helpers.ZoomApi.Response
{
    public class ZoomRecordingsResponse
    {

        public string from { get; set; }

        public string to { get; set; }

        public int page_count { get; set; }

        public int page_size { get; set; }

        public int total_records { get; set; }

        public string next_page_token { get; set; }

        public ZoomMeeting[] meetings { get; set; }

    }
}
