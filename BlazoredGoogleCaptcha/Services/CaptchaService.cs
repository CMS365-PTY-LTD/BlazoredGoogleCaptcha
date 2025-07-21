using BlazoredGoogleCaptcha.Responses;
using System.Text.Json;

namespace BlazoredGoogleCaptcha.Services
{
    public class CaptchaService
    {
        public async Task<CaptchaV2Response> VerifyV2(string secretKey, string captchaToken)
        {
            HttpClient httpClient = new HttpClient();
            var response = await httpClient.PostAsync(
                $"https://www.google.com/recaptcha/api/siteverify?secret={secretKey}&response={captchaToken}",
                null
            );
            var content = await response.Content.ReadAsStringAsync();
            var captchaResponse = JsonSerializer.Deserialize<CaptchaV2Response>(content);
            return captchaResponse;
        }
        public async Task<CaptchaV3Response> VerifyV3(string secretKey, string token, string remoteIp = null)
        {
            var content = new FormUrlEncodedContent([ new KeyValuePair<string, string>("secret", secretKey),
                new KeyValuePair<string, string>("response", token),
                new KeyValuePair<string, string>("remoteip", remoteIp ?? "")]);
            HttpClient httpClient = new HttpClient();
            var response = await httpClient.PostAsync(
                "https://www.google.com/recaptcha/api/siteverify",
                content);

            var responseString = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<CaptchaV3Response>(responseString);
            return result;
        }
    }
}
