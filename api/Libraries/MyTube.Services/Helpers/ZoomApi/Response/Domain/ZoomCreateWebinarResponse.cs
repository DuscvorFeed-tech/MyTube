using System;

namespace MyTube.Services.Helpers.ZoomApi.Response.Domain
{
    public class ZoomCreateWebinarResponse
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
        public DateTime created_at { get; set; }
        public string start_url { get; set; }
        public string join_url { get; set; }
        public string password { get; set; }
        public Settings settings { get; set; }
    }

    public class Settings
    {
        public bool host_video { get; set; }
        public bool panelists_video { get; set; }
        public int approval_type { get; set; }
        public string audio { get; set; }
        public string auto_recording { get; set; }
        public bool enforce_login { get; set; }
        public string enforce_login_domains { get; set; }
        public string alternative_hosts { get; set; }
        public bool close_registration { get; set; }
        public bool show_share_button { get; set; }
        public bool allow_multiple_devices { get; set; }
        public bool practice_session { get; set; }
        public bool hd_video { get; set; }
        public bool question_answer { get; set; }
        public bool registrants_confirmation_email { get; set; }
        public bool on_demand { get; set; }
        public bool request_permission_to_unmute_participants { get; set; }
        public string[] global_dial_in_countries { get; set; }
        public Global_Dial_In_Numbers[] global_dial_in_numbers { get; set; }
        public string contact_name { get; set; }
        public string contact_email { get; set; }
        public int registrants_restrict_number { get; set; }
        public bool registrants_email_notification { get; set; }
        public bool post_webinar_survey { get; set; }
        public bool meeting_authentication { get; set; }
        public object[] additional_data_center_regions { get; set; }
    }

    public class Global_Dial_In_Numbers
    {
        public string country_name { get; set; }
        public string number { get; set; }
        public string type { get; set; }
        public string country { get; set; }
    }

}
