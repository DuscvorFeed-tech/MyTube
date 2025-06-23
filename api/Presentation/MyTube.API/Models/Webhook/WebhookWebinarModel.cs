using System;

namespace MyTube.API.Models.Webhook
{
    public class WebhookWebinarModel
    {
        public string @event { get; set; }
        public WebhookWebinarPayload payload { get; set; }
    }

    public class WebhookWebinarPayload
    {
        public string account_id { get; set; }

        public WebhookWebinarObject @object { get; set; }
    }

    public class WebhookWebinarObject
    {
        public int duration { get; set; }
        public DateTime start_time { get; set; }
        public string timezone { get; set; }
        public string topic { get; set; }
        public string id { get; set; }
        public int type { get; set; }
        public string uuid { get; set; }
        public string host_id { get; set; }
    }
}
