using Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class JwtTokenService
    {
        private readonly IConfiguration _config;

        public JwtTokenService(IConfiguration config)
        {
           _config = config;
        }

        public string GenerateJwtToken (int UserId  ,string Email ,string Role)
        {
            var jwtSettings = _config.GetSection("JwtSettings");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!));


            var claims = new List<Claim>
            {
               
                new Claim(ClaimTypes.NameIdentifier, UserId.ToString()),
                 new Claim(ClaimTypes.Name, Email),
                 new Claim(ClaimTypes.Role, Role)
            };

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(

                 issuer: jwtSettings["Issuer"],
                 audience: jwtSettings["Audience"],
                 claims: claims,
                 expires: DateTime.UtcNow.AddHours(1),
                 signingCredentials: creds
            );                 

            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
