using System.Text.Json.Serialization;

namespace BlazoredGoogleCaptcha.Responses
{
    public class CaptchaV3Response
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }
        [JsonPropertyName("action")]
        public string Action { get; set; }
        [JsonPropertyName("score")]
        public float Score { get; set; }
        [JsonPropertyName("hostname")]
        public string Hostname { get; set; }
        [JsonPropertyName("challenge_ts")]
        public string ChallengeTimespan { get; set; }
    }
}
