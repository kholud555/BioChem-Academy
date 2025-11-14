using Application.DTOS;
using Application.Services;
using AutoMapper;
using Core.Entities;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediaController : ControllerBase
    {
        private readonly R2CloudFlareService _r2;
        private readonly MediaService _service;
        private readonly IMapper _mapper;

        public MediaController(R2CloudFlareService r2 , MediaService service , IMapper mapper)
        {
            _r2 = r2;
            _service = service;
            _mapper = mapper;
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("presign-upload")]
        public IActionResult GetUploadUrl([FromBody] PresignRequestDTO dto)
        {
            var key = $"{dto.Grade}/{dto.Term}/{dto.Unit}/Lesson{dto.LessonId}/{dto.FileName}";
            var url = _r2.GenerateUrlToUploadFiles(key);
            return Ok(new { presignedUrl = url, storageKey = key });
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("AddMediaAfterUpload")]
        public async Task<IActionResult> AddMediaAfterUpload ([FromBody] MediaDTO dto)
        {
            var newMedia = await _service.AddMediaAsync(dto);
            return Created();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteMedia")]
        public async Task<IActionResult> DeleteMedia ([FromQuery]  int mediaId)
        {
            var Deleted = await _r2.DeleteMediaAsync(mediaId);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("GetLessonMedia")]
        public async Task<ActionResult<IEnumerable<MediaAdminDTO>>> GetMediaByLessonId ( [FromQuery] int lessonId)
        {
            var mediaList = await _r2.GetMediaByLessonIdAsync(lessonId);
            return Ok(mediaList);
        }


    }
}
