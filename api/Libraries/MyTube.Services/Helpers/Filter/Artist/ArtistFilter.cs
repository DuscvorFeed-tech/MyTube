namespace MyTube.Services.Helpers.Filter.Artist
{
    public class ArtistFilter : FilterHelper
    {

        public virtual FilterType FilterType { get; }

        public string Artist { get; set; }

    }
}
