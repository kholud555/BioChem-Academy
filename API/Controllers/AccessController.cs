using Amazon.S3.Model;
using Application.DTOS;
using Application.Services;
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


        [HttpPost("GrantAccess")]
        public async Task<IActionResult> GrantAccess([FromBody] AccessControlDTO dto)
        {
            await _service.AccessGrantAsync(dto);
            return Ok();
        }

        [HttpDelete("Revoke")]
        public async Task<IActionResult> RevokeAccess([FromBody] AccessControlDTO dto)
        {
            await _service.RevokeAccessAsync(dto);
            return Ok();
        }
    }
}
