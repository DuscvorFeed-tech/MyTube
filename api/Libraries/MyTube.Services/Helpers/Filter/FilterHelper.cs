namespace MyTube.Services.Helpers.Filter
{
    public abstract class FilterHelper
    {

        public FilterHelper()
        {
            CurrentPage = 1;
        }

        /// <summary>
        /// Search record by keyword
        /// </summary>
        public string Keyword { get; set; }

        /// <summary>
        /// Holds the number of records to display per page
        /// </summary>
        public int RecordPerPage { get; set; }

        /// <summary>
        /// Holds current page position
        /// Default is 1
        /// </summary>
        public int CurrentPage { get; set; }

    }
}
