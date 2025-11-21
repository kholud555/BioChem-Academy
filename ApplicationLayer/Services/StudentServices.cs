using Application.DTOS;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Models;
using Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Services
{
    public class StudentServices
    {

        #region Fields
        private readonly UserManager<User> _userManager;
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly IStudentRepository _repo;
        private readonly IExamRepository _examRepo;
        #endregion


        #region Constructor
        public StudentServices(UserManager<User> userManager, StoreContext context, 
            IMapper mapper, IStudentRepository repo,
            IExamRepository examRepo)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
            _repo = repo;
            _examRepo = examRepo;
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
                if (!ResultOfCreateUser.Succeeded)
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

        public async Task<StudentDTO> GetProfileAsync(string id)
        {

            if (String.IsNullOrWhiteSpace(id)) throw new ArgumentNullException("Id must be provided");

            if (!int.TryParse(id, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid or missing student ID claim.");
            }
            var student = await _repo.GetStudentByIdAsync(userId);

            var dto = _mapper.Map<StudentDTO>(student);
            return dto;
        }

        public async Task<IEnumerable<Student>> GetAllStudentAsync()
            => await _repo.GetAllStudentAsync();

        public async Task<UpdateStudentProfileDTO> UpdateStudentAsync(string userIdClaim, UpdateStudentProfileDTO dto)
        {
            if (!int.TryParse(userIdClaim, out var userId))
            {
                throw new UnauthorizedAccessException("Invalid or missing student ID claim.");
            }

            var existingStudent = await _context.Students.Include(s => s.User).FirstOrDefaultAsync(s => s.UserId == userId);

            if (existingStudent == null) throw new KeyNotFoundException("Student Not Found");

            if (existingStudent.User == null) throw new KeyNotFoundException("User Not Found");


            if (dto == null) throw new ArgumentNullException("Object can not be null");

            if (!String.IsNullOrWhiteSpace(dto.UserName))
            {
                existingStudent.User.UserName = dto.UserName;
            }

            if (!String.IsNullOrWhiteSpace(dto.PhoneNumber))
            {
                existingStudent.User.PhoneNumber = dto.PhoneNumber;
            }

            if (!String.IsNullOrWhiteSpace(dto.ParentNumber))
            {
                existingStudent.ParentPhone = dto.ParentNumber;
            }

            if (!String.IsNullOrWhiteSpace(dto.Grade))
            {
                existingStudent.Grade = dto.Grade;
            }

            var isStudentUpdated = await _repo.UpdateStudentAsync(existingStudent);
            if (!isStudentUpdated) throw new InvalidOperationException("Conflict: Student did not update");

            return dto;
        }


        public async Task<int> GetStudentIdByUserID(int userId)
        {
            if (userId <= 0) throw new ArgumentNullException("UserId must be provided and greater than zero");

            return await _repo.GetStudentIdByUserID(userId);


        }

        public async Task<IEnumerable<QuestionsOfExamDTO>> GetExamQuestionByExamIdAsync(int examId)
        {
            if (examId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(examId), "ID must be greater than zero");
            }

            var examQuestionList = await _examRepo.GetExamQuestionsByIdAsync(examId);

            return examQuestionList.Select(q => new QuestionsOfExamDTO
            {
                Id = q.Id,
                QuestionHeader = q.QuestionHeader,
                Mark = q.Mark,
                Type = q.Type,

                ChoicesOfQuestion = q.QuestionChoices.Select(qc => new ChoicesOfQuestionDTO
                {
                    Id = qc.Id,
                    ChoiceText = qc.ChoiceText,
                    QuestionId = qc.QuestionId
                }).ToList()
            });
        }
    }
}
