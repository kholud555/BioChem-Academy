using Application.DTOS;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class StudentExamService
    {
        private readonly StoreContext _context;
        private readonly IStudentExamRepository _studentExamRepo;
        private readonly IExamRepository _examRepo;
        private readonly IMapper _mapper;

        public StudentExamService(
            StoreContext context,
            IStudentExamRepository studentExamRepo,
            IExamRepository examRepo,
            IMapper mapper)
        {
            _context = context;
            _studentExamRepo = studentExamRepo;
            _examRepo = examRepo;
            _mapper = mapper;
        }

        public async Task<StudentExam> SubmitExamAsync(SubmitExamDTO dto, int UserId)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Exam submission data cannot be null");

            if (dto.ExamId <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.ExamId), "ExamId must be greater than zero");

            if (UserId <= 0)
                throw new ArgumentOutOfRangeException(nameof(UserId), "userId must be greater than zero");

            if (dto.AnswerId <= 0)
                throw new ArgumentException("AnswerId must be greater than zero", nameof(dto.AnswerId));

            if (dto.QuestionId <= 0)
                throw new ArgumentException("QuestionId must be greater than zero", nameof(dto.QuestionId));

            var exam = await _examRepo.GetExamByIdAsync(dto.ExamId);

            int score = await CalculateScore(dto.AnswerId , dto.QuestionId , exam.Id);

            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == UserId);
            if (student == null)
                throw new KeyNotFoundException("Student with this user id not found");

            var studentExam = new StudentExam
            {
                ExamId = dto.ExamId,
                StudentId = student.Id,
                Score = score
            };

            return await _studentExamRepo.SubmitExamAsync(studentExam);
        }

        public async Task<IEnumerable<StudentExam>> GetStudentResultsAsync(int userId)
        {
            if (userId <= 0)
                throw new ArgumentOutOfRangeException(nameof(userId), "userId must be greater than zero");

            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            if (student == null)
                throw new KeyNotFoundException("Student with this user id not found");

            return await _studentExamRepo.GetStudentResultsAsync(student.Id);
        }

        public async Task<IEnumerable<StudentExam>> GetExamResultsAsync(int examId)
        {
            if (examId <= 0)
                throw new ArgumentOutOfRangeException(nameof(examId), "ExamId must be greater than zero");

            return await _studentExamRepo.GetExamResultsAsync(examId);
        }

        private async Task<int> CalculateScore(int answerId, int questionId , int examId)
        {
           var question = await _context.Questions.Include(q => q.QuestionChoices)
                .FirstOrDefaultAsync(q => q.Id == questionId && q.ExamId == examId);
            if (question == null) throw new KeyNotFoundException("Question not found");


            var rightAnswer = question.QuestionChoices.Where(qc =>qc.IsCorrect).FirstOrDefault();

            if (rightAnswer == null) throw new KeyNotFoundException("No answer to this question");

            if(rightAnswer.Id == answerId)
            {
                return question.Mark;
            }

            return 0;
        }

       public async Task<StudentExam> GetExamByStudentIdAndExamId(int studentId, int examId)
       {
          
            if (studentId <= 0)
                throw new ArgumentOutOfRangeException(nameof(studentId), "userId must be greater than zero");

            if (examId <= 0)
                throw new ArgumentOutOfRangeException(nameof(examId), "ExamId must be greater than zero");

            var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == studentId);
            if (student == null)
                throw new KeyNotFoundException("Student with this user id not found");

            var exam = await _examRepo.GetExamByIdAsync(examId);

            var studentExam = await _studentExamRepo.GetExamByStudentIdAndExamId(studentId, examId);
            return studentExam;
       }
    }
}
