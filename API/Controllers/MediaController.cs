using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly R2CloudFlareService _r2;

        public MediaController(R2CloudFlareService r2)
        {
            _r2 = r2;
        }

        [HttpPost("presign-upload")]
        public IActionResult GetUploadUrl([FromBody] string fileName)
        {
            var key = $"lesson1/{fileName}";
            var url = _r2.GenerateUrlToUploadFiles(key);
            return Ok(new { presignedUrl = url, storageKey = key });
        }

        [HttpGet("presign-Watch")]
        public IActionResult GetWatchUrl([FromQuery] string key)
        {
            var url = _r2.GenerateSignedUrlForViewing(key);
            return Ok(new { presignedUrl = url });
        }

    }
}
