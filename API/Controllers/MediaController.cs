using Application.DTOS;
using Application.Services;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
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


        [Authorize(Roles = "Admin")]
        [HttpPost("presign-upload")]
        public IActionResult GetUploadUrl([FromBody] PresignRequestDTO dto)
        {
            var key = $"{dto.Grade}/{dto.Term}/{dto.Unit}/Lesson{dto.LessonId}/{dto.FileName}";
            var url = _r2.GenerateUrlToUploadFiles(key);
            return Ok(new { presignedUrl = url, storageKey = key });
        }

        [Authorize(Roles = "Student")]
        [HttpGet("presign-Watch")]
        public IActionResult GetWatchUrl([FromQuery] string key)
        {
            var url = _r2.GenerateSignedUrlForViewing(key);
            return Ok(new { presignedUrl = url });
        }


    }
}
