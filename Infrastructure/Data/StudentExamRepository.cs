using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class StudentExamRepository : IStudentExamRepository
    {
        private readonly StoreContext _context;

        public StudentExamRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<StudentExam> SubmitExamAsync(StudentExam studentExam)
        {
            
            var exam = await _context.Exams
                .Include(e => e.Questions)
                    .ThenInclude(q => q.QuestionChoices)
                .FirstOrDefaultAsync(e => e.Id == studentExam.ExamId);

            if (exam == null)
                throw new KeyNotFoundException("Exam not found");

           
            var studentExists = await _context.Students.AnyAsync(s => s.Id == studentExam.StudentId);
            if (!studentExists)
                throw new KeyNotFoundException("Student not found");

            using var transaction = await _context.Database.BeginTransactionAsync();

            var alreadySubmitted = await _context.StudentExams
                .FirstOrDefaultAsync(se => se.StudentId == studentExam.StudentId && se.ExamId == studentExam.ExamId);

            if (alreadySubmitted != null)
            {
                alreadySubmitted.Score += studentExam.Score;
                alreadySubmitted.SubmittedAt = DateTime.Now;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return alreadySubmitted;
            }

            var newStudentExam = new StudentExam
            {
                ExamId = studentExam.ExamId,
                StudentId = studentExam.StudentId,
                Score = studentExam.Score,
                SubmittedAt = DateTime.Now
            };

            await _context.StudentExams.AddAsync(newStudentExam);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return await _context.StudentExams
                .Include(se => se.Exam)
                .Include(se => se.Student)
                .FirstOrDefaultAsync(se => se.Id == newStudentExam.Id);
        }

        public async Task<IEnumerable<StudentExam>> GetStudentResultsAsync(int studentId)
        {
            var results = await _context.StudentExams
                .Where(se => se.StudentId == studentId)
                .Include(se => se.Exam)
                    .ThenInclude(e => e.Questions)
                .Include(se => se.Student)
                .OrderByDescending(se => se.SubmittedAt)
                .ToListAsync();

            if (results.Count == 0)
                throw new KeyNotFoundException("No exam results found for this student");

            return results;
        }

        public async Task<IEnumerable<StudentExam>> GetExamResultsAsync(int examId)
        {
            var results = await _context.StudentExams
                .Where(se => se.ExamId == examId)
                .Include(se => se.Exam)
                    .ThenInclude(e => e.Questions)
                .Include(se => se.Student)
                .OrderByDescending(se => se.Score)
                .ToListAsync();

            if (results.Count == 0)
                throw new KeyNotFoundException("No results found for this exam");

            return results;
        }

        public async Task<bool> HasStudentSubmittedExamAsync(int studentId, int examId)
        {
            return await _context.StudentExams
                .AnyAsync(se => se.StudentId == studentId && se.ExamId == examId);
        }
    }
}
