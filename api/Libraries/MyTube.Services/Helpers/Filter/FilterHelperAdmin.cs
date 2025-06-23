namespace MyTube.Services.Helpers.Filter
{
    public abstract class FilterHelperAdmin
    {

        public FilterHelperAdmin()
        {
            this.PageNumber = 1;
        }

        /// <summary>
        /// The page number of the current results.
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// The number of records returned with a single API call.
        /// </summary>
        public int PageSize { get; set; }

    }
}
