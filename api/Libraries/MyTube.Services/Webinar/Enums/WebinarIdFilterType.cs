namespace MyTube.Services.Zoom.Webinar
{
    public enum WebinarIdFilterType
    {

        /// <summary>
        /// webinar.Id
        /// </summary>
        Id,


        /// <summary>
        /// webinar.ZoomAppId
        /// </summary>
        ZoomAppId,

        /// <summary>
        /// webinar.CreatedBy = User.Id
        /// </summary>
        CreatedBy,

    }
}
