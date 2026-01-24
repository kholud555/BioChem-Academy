using Application.DTOS;
using Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonsController : ControllerBase
    {
        private readonly LessonService _lessonService;
        private readonly IMapper _mapper;

        public LessonsController(LessonService lessonService, IMapper mapper)
        {
            _lessonService = lessonService;
            _mapper = mapper;
        }

        [Authorize(Roles = "Admin,Student")]
        [HttpGet("{unitId:int}")]
        public async Task<ActionResult<IEnumerable<LessonDTO>>> GetLessonsByUnit(int unitId)
        {
            var lessons = await _lessonService.GetLessonsByUnitAsync(unitId);
            var dto = _mapper.Map<IEnumerable<LessonDTO>>(lessons);
            return Ok(dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("lessons/{id:int}")]
        public async Task<ActionResult<LessonDTO>> GetLessonById(int id)
        {
            var lesson = await _lessonService.GetLessonByIdAsync(id);
            var dto = _mapper.Map<LessonDTO>(lesson);
            return Ok(dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("lessons")]
        public async Task<ActionResult> AddLesson([FromBody] CreateLessonDTO dto)
        {
            var newLesson = await _lessonService.CreateLessonAsync(dto);
            var finalNewLessonDto = _mapper.Map<LessonDTO>(newLesson);
            return CreatedAtAction(nameof(GetLessonById), new { id = finalNewLessonDto.Id }, finalNewLessonDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("lessons/{id:int}")]
        public async Task<ActionResult> UpdateLesson(int id, [FromBody] LessonDTO dto)
        {
            if (id != dto.Id)
                return BadRequest("ID in URL does not match ID in body");

            await _lessonService.UpdateLessonAsync(dto);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("lessons/{id:int}")]
        public async Task<ActionResult> DeleteLesson(int id)
        {
            var success = await _lessonService.DeleteLessonAsync(id);
            if (!success) return NotFound("Lesson failed to delete");
            return NoContent();
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateIsFree")]
        public async Task<IActionResult> UpdateIsFreeLesson (int lessonId , bool isFree)
        {
            var updated = await _lessonService.UpdateIsFree(lessonId, isFree);
            return NoContent();
        }
    }
}
