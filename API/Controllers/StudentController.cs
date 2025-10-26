using API.DTOS;
using Application.DTOS;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Application.Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        #region Fields
        private readonly StudentServices _service;
        private readonly IMapper _mapper;
        #endregion

        #region Constructor
        public StudentController(StudentServices service, IMapper mapper)
        {
            _service = service;
           _mapper = mapper;
        }

        #endregion

        [AllowAnonymous]
        [HttpPost("RegisterStudent")]
        public async Task<ActionResult<StudentRegisterDTO>> Registration ([FromBody]  StudentRegisterDTO dto)
        {
            try
            {
               
                var StudentModel = new StudentRegistrationModel(dto.UserName, dto.Email, dto.Password, dto.Grade, dto.PhoneNumber, dto.ParentPhone);
  

                var result = await _service.Registration(StudentModel);
               // await confirmationEmail.SendConfirmationEmail(dto.Email, await userManager.FindByEmailAsync(dto.Email));
                return Created("UserCreated",dto);
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("already exists"))
            {
                // Duplicate user detected - return client-friendly 400 Bad Request
                return BadRequest(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                // Input validation error
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                // Unexpected error - return 500 Internal Server Error with message
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [Authorize(Roles ="Admin")]
        [HttpGet("GetAllStudents")]
        public async Task<ActionResult<IEnumerable<StudentDTO>>> GetAllStudentsAsync ()
        {
            var students = await _service.GetAllStudentAsync();
            var dto = _mapper.Map<IEnumerable<StudentDTO>>(students);
            return Ok(dto);
        }

        [Authorize(Roles = "Student")]
        [HttpGet("GetStudentProfile")]
        public async Task<ActionResult<StudentDTO>> GetStudentProfile ()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var StudentProfile = await _service.GetProfileAsync(userId);

            return Ok(StudentProfile);
        }


        [Authorize(Roles = "Student")]
        [HttpPut("UpdateStudentProfile")]
        public async Task<ActionResult<UpdateStudentProfileDTO>> UpdateStudentProfile ([FromBody] UpdateStudentProfileDTO student)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var updateProfile = await _service.UpdateStudentAsync(userId, student);

            return Ok(updateProfile);
        }
    }
}
