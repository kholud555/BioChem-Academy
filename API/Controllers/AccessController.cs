using Amazon.S3.Model;
using Application.DTOS;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessController : ControllerBase
    {
        private readonly AccessControlService _service;

        public AccessController(AccessControlService service)
        {
           _service = service;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("GrantAccess")]
        public async Task<IActionResult> GrantAccess([FromBody] AccessControlDTO dto)
        {
            await _service.AccessGrantAsync(dto);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("Revoke")]
        public async Task<IActionResult> RevokeAccess([FromBody] AccessControlDTO dto)
        {
            await _service.RevokeAccessAsync(dto);
            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<StudentPermissionsDTO>> GetStudentPermissions1q(int studentId , [FromQuery] bool IncludedNames = false)
        {
            var studentPermissions = await _service.GetStudentPermissionsAsync(studentId, IncludedNames);
            return Ok(studentPermissions);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("StructureOfGrade")]
        public async  Task<ActionResult<AcademicStructureDTO>> StructureOfGradeForStudent (int subjectId , string gradeName)
        {
            var dto = await _service.GetAcademicStructureBySubjectAndGradeNameAsync(subjectId, gradeName);
            return Ok(dto);
        }

    }
}
