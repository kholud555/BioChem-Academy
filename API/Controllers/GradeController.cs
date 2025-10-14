using Application.DTOS;
using Application.Services;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<ActionResult<Grade>> GetGradeById (int id )
        {
            var grade =  await _service.GetGradeByIdAsync (id);
            var dto = _mapper.Map<GradeDTO>(grade);
            return Ok(dto);
        }

        [HttpPost("{gradeName}")]
        public async Task<ActionResult> AddGrade(string gradeName)
        {
            var newGrade = await _service.CreateGradeAsync(gradeName);

            return CreatedAtAction(nameof(GetGradeById), new { id = newGrade.Id }, newGrade);
        }

        [HttpPatch("Update Grade")]
        public async Task<ActionResult> UpdateGrade (GradeDTO dto )
        {
            var grade = new Grade
            { 
                Id = dto.ID,
                GradeName = dto.GradeName
            };
            var existGrade = await _service.UpdateGradeAsync(grade);
            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteGrade (int id)
        {
            await _service.DeleteGradeAsync(id);
            return NoContent();
        }

    }
}
