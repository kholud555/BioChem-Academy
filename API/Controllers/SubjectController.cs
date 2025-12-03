using Application.DTOS;
using Application.Services;
using AutoMapper;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectController : ControllerBase
    {
        private readonly SubjectService _service;
        private readonly IMapper _mapper;

        public SubjectController(SubjectService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<SubjectDTO>> GetSubjectById(int id)
        {
            var subject = await _service.GetSubjectByIdAsync(id);
            var dto = _mapper.Map<SubjectDTO>(subject);
            return Ok(dto);
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("AddSubject")]
        public async Task<ActionResult> AddSubject (string subjectName)
        {
            var newSubject = await _service.CreateSubjectAsync(subjectName);

            var newSubjectDto = _mapper.Map<SubjectDTO>(newSubject);

            return Ok(newSubjectDto);
        }

        [HttpGet("GetAllSubjects")]
        public async Task<ActionResult<IEnumerable<SubjectDTO>>> GetAllSubject()
        {
            var subjects = await _service.GetAllSubjectsAsync();
            var dto = _mapper.Map<IEnumerable<SubjectDTO>>(subjects);
            return Ok(dto);
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("Update subject")]
        public async Task<ActionResult> UpdateSubject(SubjectDTO dto)
        {
            var subject = new Subject
            {
                Id = dto.ID,
                SubjectName = dto.SubjectName
            };
            var existGrade = await _service.UpdateSubjectAsync(subject);
            return Ok(dto);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var success = await _service.DeleteSubjectAsync(id);
            if (!success) return NotFound("Subject failed to delete");
            return NoContent();
        }
    }
}
