using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace Application.Services
{
    public class StudentServices : IStudentService
    {

        #region Fields
        private readonly UserManager<User> _userManager;
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly IStudentRepository _repo;
        #endregion


        #region Constructor
        public StudentServices(UserManager<User> userManager, StoreContext context, IMapper mapper , IStudentRepository repo)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
            _repo = repo;
        }

        
        #endregion

        public async Task<Student> Registration(StudentRegistrationModel studentModel)
        {
            studentModel.ValidateStudentInfo();

            var existingUserByEmail = await _userManager.FindByEmailAsync(studentModel.Email);
            if (existingUserByEmail != null)
                throw new InvalidOperationException("A user with this email already exists.");

            var existingUserByUserName = await _userManager.FindByNameAsync(studentModel.UserName);
            if (existingUserByUserName != null)
                throw new InvalidOperationException("A user with this user Name already exists.");

            using var transaction = await _context.Database.BeginTransactionAsync();


            try
            {
                var newUser = new User()
                {

                    UserName = studentModel.UserName,
                    Email = studentModel.Email,
                    PhoneNumber = studentModel.PhoneNumber,
                    Role = RoleEnum.Student,
                    CreatedAt = DateTime.Now
                };

                

                var ResultOfCreateUser = await _userManager.CreateAsync(newUser, studentModel.Password);
                if(! ResultOfCreateUser.Succeeded)
                {
                    var errors = string.Join("; ", ResultOfCreateUser.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to create user: {errors}");
                }

                var roleAssignResult = await _userManager.AddToRoleAsync(newUser, "Student");
                if (!roleAssignResult.Succeeded)
                {
                    var errors = string.Join("; ", roleAssignResult.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Failed to assign role: {errors}");
                }

                var newStudent = new Student
                {
                    ParentPhone = studentModel.ParentPhone,
                    Grade = studentModel.Grade,
                    User = newUser
                };

                
                //?
                newStudent.User.Student = null;

                await _repo.Registration(newStudent);
                // Commit transaction only if all succeeded
                await transaction.CommitAsync();

                return newStudent;
            }
            catch
            {
                // Rollback transaction contacts everything created within this scope
                await transaction.RollbackAsync();

                // delete user if created outside transaction (UserManager may create user outside EF)
                var userToDelete = await _userManager.FindByNameAsync(studentModel.UserName);
                if (userToDelete != null)
                {
                    await _userManager.DeleteAsync(userToDelete);
                }

                throw; // rethrow error
            }
        }

        public  async Task<Student> GetProfileAsync(string id)
        {
            
            if (String.IsNullOrWhiteSpace(id)) throw new ArgumentNullException("Id must be provided");
            int ID = int.Parse(id);
            return await _repo.GetStudentByIdAsync(ID);
        }
    }
}
