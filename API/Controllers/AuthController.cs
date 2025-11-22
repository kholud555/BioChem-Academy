using Application.DTOS;
using Application.Services;
using Azure.Core;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        #region Fields
        private readonly UserManager<User> _userManager;
        private readonly JwtTokenService _jwtTokenService;
        #endregion

        #region Constructor
        public AuthController(JwtTokenService jwtTokenService, UserManager<User> userManager)
        {
            _jwtTokenService = jwtTokenService;
            _userManager = userManager;
        }
        #endregion

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            //Check Email
            if (user == null)
                return Unauthorized("Invalid Email or password");

            // Check password
            if (!await _userManager.CheckPasswordAsync(user, dto.Password))
                return Unauthorized("Invalid  Email or password");

            // Generate token
            var token = await _jwtTokenService.GenerateJwtToken(user);

            return Ok(new
            {
                Token = token,
                Role = user.Role.ToString(),
                UserName = user.UserName,
                userId = user.Id
            });
        }
    }
}
