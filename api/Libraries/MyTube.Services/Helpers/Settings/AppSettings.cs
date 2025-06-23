namespace MyTube.Services.Helpers.Settings
{
    public class AppSettings
    {

        public string Environment { get; set; }

        public string Secret { get; set; }

        public int TokenExpiration { get; set; }

        public string LogsFolder { get; set; }

        public string UploadFolder { get; set; }

        public string DownloadFolder { get; set; }

        public int RecordPerPage { get; set; }

        public int MaxRecordPerPage { get; set; }

        public string ApiUrl { get; set; }

        public int PrivateKeyLength { get; set; }

        public string EthereumUrl { get; set; }

        public string FfmpegAppPath { get; set; }

        public string PaidContentHashPrefix { get; set; }

        public int PaidContentHashLength { get; set; }

        public int PayPerViewCouponCodeLength { get; set; }

        public int PayPerViewCouponCodeValidity { get; set; }

    }
}
