namespace MyTube.Services.Helpers.Logging
{
    public interface IWeRaveYouLog
    {
        void Information(string message);

        void Warning(string message);

        void Debug(string message);

        void Error(string message);

    }

}
