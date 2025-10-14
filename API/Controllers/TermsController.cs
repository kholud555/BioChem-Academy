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

        // GET: api/courses/{courseId}/terms
        [HttpGet("~/api/courses/{courseId}/terms")]
        public async Task<ActionResult<IEnumerable<Term>>> GetTermsByCourse(int courseId)
        {
            var terms = await _termService.GetTermsByCourseAsync(courseId);
            return Ok(terms);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Term>> GetTermById(int id)
        {
            var term = await _termService.GetTermByIdAsync(id);
            var dto = _mapper.Map<TermDTO>(term);
            return Ok(dto);
        }

        // POST: api/terms
        [HttpPost]
        public async Task<ActionResult> AddTerm([FromBody] Term term)
        {
            var newTerm = await _termService.CreateTermAsync(term.TermOrder, term.GradeId);
            return CreatedAtAction(nameof(GetTermById), new { id = newTerm.Id }, newTerm);
        }

        // PUT: api/terms/{id}
        [HttpPut("{id:int}")]

        public async Task<ActionResult> UpdateTerm(int id, [FromBody] Term updated)
        {
            var success = await _termService.UpdateTermAsync(id, updated.TermOrder);
            if (!success) return NotFound();
            return NoContent();
        }

        // DELETE: api/terms/{id}
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteTerm(int id)
        {
            var success = await _termService.DeleteTermAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}

