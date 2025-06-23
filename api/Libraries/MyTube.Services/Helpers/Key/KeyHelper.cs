using System;
using System.Linq;

namespace MyTube.Services.Helpers.Key
{
    public static class KeyHelper
    {

        public static string Generate(int length)
        {
            return Generate(length, false);
        }

        public static string Generate(int length, bool numbersOnly)
        {
            string alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string small_alphabets = "abcdefghijklmnopqrstuvwxyz";
            string numbers = "1234567890";

            string characters = numbers;
            if (!numbersOnly)
            {
                characters += alphabets + small_alphabets;
            }

            var repeatChars = Enumerable.Repeat(characters, length);

            var otp = new string(repeatChars.SelectMany(str => str)
                                .OrderBy(c => Guid.NewGuid())
                                .Take(length).ToArray());

            return otp;
        }

    }
}
