using Application.DTOS;
using Application.Services;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradeController : ControllerBase
    {
        private readonly GradeService _service;
        private readonly IMapper _mapper;
 
        public GradeController (GradeService service , IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }
      

        [HttpGet("{id:int}")]
        public async Task<ActionResult<GradeDTO>> GetGradeById (int id )
        {
            var grade =  await _service.GetGradeByIdAsync (id);
            var dto = _mapper.Map<GradeDTO>(grade);
            return Ok(dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("{gradeName}")]
        public async Task<ActionResult> AddGrade(string gradeName)
        {
            var newGrade = await _service.CreateGradeAsync(gradeName);

            var newGradeDto = _mapper.Map<GradeDTO> (newGrade);

            return CreatedAtAction(nameof(GetGradeById), new { id = newGradeDto.ID }, newGradeDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("Update Grade")]
        public async Task<ActionResult> UpdateGrade (GradeDTO dto )
        {
            var grade = new Grade
            { 
                Id = dto.ID,
                GradeName = dto.GradeName
            };
            var existGrade = await _service.UpdateGradeAsync(grade);
            return Ok(dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteGrade (int id)
        {
            var success = await _service.DeleteGradeAsync(id);
            if (!success) return NotFound("Term failed to delete");
            return NoContent();
        }

        [HttpGet("GetAllGrades")]
        public async Task<ActionResult<IEnumerable<GradeDTO>>> GetAllGrade ()
        {
            var grades = await _service.GetAllGradeAsync();
            var dto = _mapper.Map<IEnumerable<GradeDTO>> (grades);
            return Ok(dto);
        }

    }
}
