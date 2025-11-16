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
    public class ExamRepository : IExamRepository
    {
        private readonly StoreContext _context;

        public ExamRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Exam>> GetExamsByLessonAsync(int lessonId)
        {
            var exams = await _context.Exams
                .Where(e => e.ReferenceId == lessonId && e.Level == ExamLevelEnum.Lesson)
                .Include(e => e.Questions)
                .Include(e => e.StudentExam)
                .ToListAsync();

            if (exams.Count == 0)
                throw new KeyNotFoundException("No exams found for this lesson");

            return exams;
        }

        public async Task<Exam> GetExamByIdAsync(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .Include(e => e.StudentExam)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
                throw new KeyNotFoundException("Exam Not Found");

            return exam;
        }

        public async Task<Exam> AddExamAsync(Exam exam)
        {
            
            var isLessonExist = await _context.Lessons.AnyAsync(l => l.Id == exam.ReferenceId);

            if (!isLessonExist)
                throw new InvalidOperationException("Conflict: No Lesson matches your input.");

           
            var isExisting = await _context.Exams
                .AnyAsync(e => e.ReferenceId == exam.ReferenceId
                          && e.Level == exam.Level
                          && e.Title == exam.Title);

            if (isExisting)
                throw new InvalidOperationException("Conflict: Exam with this title already exists for this lesson.");

            var newExam = new Exam
            {
                Title = exam.Title,
                Description = exam.Description,
                Level = exam.Level,
                ReferenceId = exam.ReferenceId,
                TimeLimit = exam.TimeLimit,
                IsPublished = exam.IsPublished,
                CreatedAt = DateTime.Now
            };

            await _context.Exams.AddAsync(newExam);
            await _context.SaveChangesAsync();
            return newExam;
        }

        public async Task<bool> UpdateExamAsync(Exam exam)
        {
            var existingExam = await _context.Exams.FindAsync(exam.Id);
            if (existingExam == null) return false;

          
            var isDuplicate = await _context.Exams
                .AnyAsync(e => e.ReferenceId == exam.ReferenceId
                          && e.Level == exam.Level
                          && e.Title == exam.Title
                          && e.Id != exam.Id);

            if (isDuplicate)
                throw new InvalidOperationException("Conflict: Exam with this title already exists.");

            existingExam.Title = exam.Title;
            existingExam.Description = exam.Description;
            existingExam.Level = exam.Level;
            existingExam.ReferenceId = exam.ReferenceId;
            existingExam.TimeLimit = exam.TimeLimit;
            existingExam.IsPublished = exam.IsPublished;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteExamAsync(int id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null) return false;

            _context.Exams.Remove(exam);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
