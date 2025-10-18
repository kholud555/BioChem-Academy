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
        private readonly UserManager<User> _userManager;
 
        public GradeController (GradeService service , IMapper mapper , UserManager<User> userManager)
        {
            _service = service;
            _mapper = mapper;
            _userManager = userManager;
        }
      
        [HttpGet("{id:int}")]
        public async Task<ActionResult<GradeDTO>> GetGradeById (int id )
        {
            var grade =  await _service.GetGradeByIdAsync (id);
            var dto = _mapper.Map<GradeDTO>(grade);
            return Ok(dto);
        }

        [HttpPost("{gradeName}")]
        public async Task<ActionResult> AddGrade(string gradeName)
        {
            var newGrade = await _service.CreateGradeAsync(gradeName);

            var newGradeDto = _mapper.Map<GradeDTO> (newGrade);

            return CreatedAtAction(nameof(GetGradeById), new { id = newGradeDto.ID }, newGradeDto);
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
            return Ok(dto);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteGrade (int id)
        {
            var success = await _service.DeleteGradeAsync(id);
            if (!success) return NotFound("Term failed to delete");
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllGrades")]
        public async Task<ActionResult<IEnumerable<GradeDTO>>> GetAllGrade ()
        {
            var grades = await _service.GetAllGradeAsync();
            var dto = _mapper.Map<IEnumerable<GradeDTO>> (grades);
            return Ok(dto);
        }

        [AllowAnonymous]
        [HttpGet("whoami")]
        public async Task<IActionResult> WhoAmI()
        {
            var userEmail = User?.Identity?.Name;
            if (userEmail == null) return Unauthorized("No user found");

            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user == null) return NotFound("User not found");

            return Ok(new { user.Email, user.Role });
        }


    }
}
