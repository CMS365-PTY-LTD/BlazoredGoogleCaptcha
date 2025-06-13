using System.Text.Json.Serialization;

namespace BlazoredGoogleCaptcha.Responses
{
    public class CaptchaV2Response
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }
        [JsonPropertyName("hostname")]
        public string Hostname { get; set; }
        [JsonPropertyName("challenge_ts")]
        public string ChallengeTimespan { get; set; }
        [JsonPropertyName("error-codes")]
        public string[] ErrorCodes { get; set; }
    }
}
