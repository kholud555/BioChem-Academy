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
                throw new ArgumentOutOfRangeException(nameof(UserId), "StudentId must be greater than zero");

            if (dto.Answers == null || dto.Answers.Count == 0)
                throw new ArgumentException("Answers cannot be empty", nameof(dto.Answers));

          
            var exam = await _examRepo.GetExamByIdAsync(dto.ExamId);

            int score = CalculateScore(dto.Answers, exam.Questions.ToList());

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

        public async Task<IEnumerable<StudentExam>> GetStudentResultsAsync(int studentId)
        {
            if (studentId <= 0)
                throw new ArgumentOutOfRangeException(nameof(studentId), "StudentId must be greater than zero");

            return await _studentExamRepo.GetStudentResultsAsync(studentId);
        }

        public async Task<IEnumerable<StudentExam>> GetExamResultsAsync(int examId)
        {
            if (examId <= 0)
                throw new ArgumentOutOfRangeException(nameof(examId), "ExamId must be greater than zero");

            return await _studentExamRepo.GetExamResultsAsync(examId);
        }

        private int CalculateScore(List<StudentAnswerDTO> studentAnswers, List<Question> questions)
        {
            int correctAnswers = 0;

            foreach (var studentAnswer in studentAnswers)
            {
                var question = questions.FirstOrDefault(q => q.Id == studentAnswer.QuestionId);
                if (question == null) continue;

                var correctAnswer = question.QuestionChoices.FirstOrDefault(a => a.IsCorrect);
                if (correctAnswer != null && correctAnswer.Id == studentAnswer.AnswerId)
                {
                    correctAnswers++;
                }
            }

         
            if (questions.Count == 0) return 0;
            return (int)Math.Round((double)correctAnswers / questions.Count * 100);
        }
    }
}
