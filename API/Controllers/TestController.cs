using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public TestController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        [Authorize]
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("✅ API is working!");
        }

        [AllowAnonymous]
        [HttpGet("AllowAnonymous")]
        public IActionResult AdminOnly()
        {
            return Ok("✅ AllowAnonymous works!");
        }

        [AllowAnonymous]
        [HttpGet("check-my-roles")]
        public async Task<IActionResult> CheckMyRoles()
        {
            var email = "BioChem_Academy111@gmail.com";
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                return NotFound("User not found");

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                Email = user.Email,
                Username = user.UserName,
                RolesInIdentity = roles, // ده المهم
                RoleEnumProperty = user.Role.ToString()
            });
        }
    }
}
