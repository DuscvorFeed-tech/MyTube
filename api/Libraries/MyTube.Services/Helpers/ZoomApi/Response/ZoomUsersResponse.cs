using MyTube.Services.Helpers.ZoomApi.Response.Domain;

namespace MyTube.Services.Helpers.ZoomApi.Response
{
    public class ZoomUsersResponse
    {

        public int page_count { get; set; }

        public int page_number { get; set; }

        public int page_size { get; set; }

        public int total_records { get; set; }

        public ZoomUser[] users { get; set; }

    }

}
