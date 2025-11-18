using Application.DTOS;
using Application.Services;
using AutoMapper;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TermsController : ControllerBase
    {
        private readonly TermService _termService;
        private readonly IMapper _mapper;

        public TermsController(TermService termService , IMapper mapper)
        {
            _termService = termService;
            _mapper = mapper;
        }

        [HttpGet("GetTermsByGrade")]
        public async Task<ActionResult<IEnumerable<TermDTO>>> GetTermsByGrade(int gradeId)
        {
            var terms = await _termService.GetTermsByGradeAsync(gradeId);
            var dto = _mapper.Map<IEnumerable<TermDTO>>(terms);
            return Ok(dto);
        }

       
        [HttpGet("{id:int}")]
        public async Task<ActionResult<TermDTO>> GetTermById(int id)
        {
            var term = await _termService.GetTermByIdAsync(id);
            var dto = _mapper.Map<TermDTO>(term);
            return Ok(dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("AddTerm")]
        public async Task<ActionResult> AddTerm([FromBody] CreateTermDTO dto)
        {
            var newTerm = await _termService.CreateTermAsync(dto);
            var finalNewTermDto = _mapper.Map<TermDTO>(newTerm);
            return  CreatedAtAction(nameof(GetTermById),new { id = finalNewTermDto.Id },finalNewTermDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateTerm")]
        public async Task<IActionResult> UpdateTerm([FromBody] TermDTO dto)
        {
            var term = await _termService.UpdateTermAsync(dto);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteTerm(int id)
        {
            var success = await _termService.DeleteTermAsync(id);
            if (!success) return NotFound("Term failed to delete");
            return NoContent();
        }
    }
}

