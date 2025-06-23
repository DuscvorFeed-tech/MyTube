namespace MyTube.Core.Helpers.Extensions
{
    public static class StringExtension
    {

        /// <summary>
        /// Check if string has value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool HasValue(this string value)
        {
            return !string.IsNullOrWhiteSpace(value);
        }

        /// <summary>
        /// Check if nullable int has value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool HasValue(this int? value)
        {
            return value != null;
        }

        /// <summary>
        /// Check if nullable long has value
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool HasValue(this long? value)
        {
            return value != null;
        }

    }
}
