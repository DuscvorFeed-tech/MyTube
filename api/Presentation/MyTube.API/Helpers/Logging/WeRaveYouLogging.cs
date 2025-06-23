using NLog;
using MyTube.Services.Helpers.Logging;

namespace MyTube.API.Helpers.Logging
{
    public class WeRaveYouLogging : IWeRaveYouLog
    {

        private static readonly ILogger logger = LogManager.GetCurrentClassLogger();

        public WeRaveYouLogging()
        { }

        public void Information(string message)
        {
            logger.Info(message);
        }

        public void Warning(string message)
        {
            logger.Warn(message);
        }

        public void Debug(string message)
        {
            logger.Debug(message);
        }

        public void Error(string message)
        {
            logger.Error(message);
        }

    }
}
