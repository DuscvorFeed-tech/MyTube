using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MyTube.Core.Domain.Webinar.Enums;
using MyTube.Services.Helpers.Filter.Artist;
using MyTube.Services.Helpers.Filter.Webinar;
using MyTube.Services.Helpers.Responses;
using MyTube.Services.Zoom.Webinar;

namespace MyTube.Services.Webinar
{
    public interface IWebinarService
    {

        Task<BaseResponse> InsertWebinarAsync(Core.Domain.Webinar.Webinar zoomWebinar, List<string> performer, long userId, IFormFile announcementImage);
        
        Task<object> GetWebinarListAsync(Helpers.Filter.Webinar.WebinarFilter filter);

        Task<object> GetWebinarAsync(long id);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">webinar.Id</param>
        /// <param name="zoomAppId">webinar.ZoomAppId</param>
        /// <returns></returns>
        Task<int> GetWebinarCountAsync(long id, long zoomAppId);

        Task<BaseResponse> UpdateWebinarAsync(long id, bool active);

        Task<BaseResponse> UpdateWebinarAsync(long id, string youtubeUrl);
        
        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">Zoom_id</param>
        /// <param name="webinarStatus"></param>
        /// <returns></returns>
        Task<BaseResponse> UpdateWebinarAsync(string id, WebinarStatusType webinarStatus);


        Task<Core.Domain.Webinar.Webinar> GetWebinarAsync(long id, bool idIsEqualToZoom_id);

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id">Zoom_id</param>
        /// <param name="uuid">Zoom_uuid</param>
        /// <returns></returns>
        Task<Core.Domain.Webinar.Webinar> GetWebinarAsync(long id, string uuid);
        
        int GetWebinarCount(long id, DateTime? webinarStart, WebinarIdFilterType idFilterType);

        long? GetWebinarCount(string liveTicketHash, WebinarStatusType webinarStatus);
        
        long? GetWebinarCount(long createdBy, string liveTicketHash);

        Task<object> GetWebinarCalendarListAsync(WebinarCalendarFilter filter);
        
        Task<object> GetListAsync(ArtistWebinarFilter filter);

        Core.Domain.Webinar.Webinar GetWebinar(string liveTicketHash, bool asNoTracking = true);

        long? GetWebinarCount(string liveTicketHash, bool withAvailableLiveTicket);
        
        Task<List<Core.Domain.Webinar.Webinar>> GetWebinarListAsync(ApprovalEmailStatus approvalEmailStatus);
        
        Task<BaseResponse> UpdateWebinarAsync(long id, ApprovalEmailStatus approvalEmailStatus);

        Task<List<Core.Domain.Webinar.Webinar>> GetWebinarPastWebinarListAsync(WebinarStatusType[] webinarStatuses, bool asNoTracking = false);

        Task<BaseResponse> UpdateWebinarAsync(Core.Domain.Webinar.Webinar webinar);

    }

}
