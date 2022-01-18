namespace BarcodeGenerator.Models
{
    public class Code128Generator
    {
        public static string Encode(string content)
        {
            char start = (char)204;
            char stop = (char)206;
            //string content = "01020-L";
            char sum = GetCheckSum(content);
            return start + content + sum + stop;
        }

        private static char GetCheckSum(string content)
        {
            int sum = 104;
            for (int i = 0; i < content.Length; i++)
            {
                int code = CodeValueForChar(content[i]);
                sum += code * (i + 1);
            }
            int modulSum = (sum % 103);
            return DecodeToAscii(modulSum);
        }

        private static char DecodeToAscii(int modulSum)
        {
            if (modulSum == 0)
                return (char)194;
            else if (modulSum <= 94)
                return (char)(modulSum + 32);
            else
                return (char)(modulSum + 100);
        }

        private static int CodeValueForChar(int CharAscii)
        {
            return (CharAscii >= 32) ? CharAscii - 32 : CharAscii + 64;
        }

    }
}
