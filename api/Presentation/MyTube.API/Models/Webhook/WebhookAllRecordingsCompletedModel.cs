using System;

namespace MyTube.API.Models.Webhook
{
    
    public class WebhookAllRecordingsCompletedModel
    {
        public WebhookAllRecordingsCompletedPayload payload { get; set; }
        public string @event { get; set; }
        public string download_token { get; set; }
    }

    public class WebhookAllRecordingsCompletedPayload
    {
        public string account_id { get; set; }
        public WebhookAllRecordingsCompletedObject @object { get; set; }
    }

    public class WebhookAllRecordingsCompletedObject
    {
        public string uuid { get; set; }
        public long id { get; set; }
        public string account_id { get; set; }
        public string host_id { get; set; }
        public string topic { get; set; }
        public int type { get; set; }
        public DateTime start_time { get; set; }
        public string timezone { get; set; }
        public string host_email { get; set; }
        public int duration { get; set; }
        public int total_size { get; set; }
        public int recording_count { get; set; }
        public string share_url { get; set; }
        public WebhookAllRecordingsCompletedRecording_Files[] recording_files { get; set; }
        public string password { get; set; }
    }

    public class WebhookAllRecordingsCompletedRecording_Files
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
