using Application.DTOS;
using Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamController : ControllerBase
    {
        private readonly ExamService _service;
        private readonly IMapper _mapper;

        public ExamController(ExamService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

      
        [HttpGet("/api/lessons/{lessonId}/exams")]
        public async Task<ActionResult<IEnumerable<ExamDTO>>> GetExamsByLesson(int lessonId)
        {
            var exams = await _service.GetExamsByLessonAsync(lessonId);
            var dto = _mapper.Map<IEnumerable<ExamDTO>>(exams);
            return Ok(dto);
        }

       
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ExamDetailsDTO>> GetExamById(int id)
        {
            var exam = await _service.GetExamByIdAsync(id);
            var dto = _mapper.Map<ExamDetailsDTO>(exam);
            return Ok(dto);
        }

        // POST /api/exams
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> AddExam([FromBody] CreateExamDTO dto)
        {
            var newExam = await _service.CreateExamAsync(dto);
            var finalNewExamDto = _mapper.Map<ExamDTO>(newExam);
            return CreatedAtAction(nameof(GetExamById), new { id = finalNewExamDto.Id }, finalNewExamDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateExam(int id, [FromBody] ExamDTO dto)
        {
            if (id != dto.Id)
            {
                return BadRequest("ID mismatch between route and body");
            }

            await _service.UpdateExamAsync(dto);
            return NoContent();
        }


        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteExam(int id)
        {
            var success = await _service.DeleteExamAsync(id);
            if (!success) return NotFound("Exam failed to delete");
            return NoContent();
        }
    }
}
