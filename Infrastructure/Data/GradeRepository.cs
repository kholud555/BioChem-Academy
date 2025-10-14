using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class GradeRepository : IGradeRepository
    {
        private readonly StoreContext _context;
        public GradeRepository(StoreContext context) 
        {
            _context = context;
        }

        private async Task<Grade> GetGradeByIdInternalAsync(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null)
                throw new KeyNotFoundException("Grade Not Found");
            return grade;
        }

        public async Task<Grade> GetGradeByIdAsync(int id)
        {
            return await GetGradeByIdInternalAsync(id);
        }

        public async Task<Grade> CreateGradeAsync(string gradeName)
        {
            // Check for duplicate
            var existing = await _context.Grades
                .FirstOrDefaultAsync(g => g.GradeName == gradeName);
            if (existing != null)
                throw new InvalidOperationException ($"conflict Grade with name '{gradeName}' already exists");
            var newGrade = new Grade { GradeName = gradeName};
            _context.Grades.Add(newGrade);
            await _context.SaveChangesAsync();
            return newGrade;
        }

        public async Task<Grade> UpdateGradeNameAsync (Grade grade)
        {
            var existing = await GetGradeByIdInternalAsync(grade.Id);
            existing.GradeName = grade.GradeName;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteGradeAsync (int id)
        {
            var grade = await GetGradeByIdInternalAsync(id);
            _context.Grades.Remove(grade);
            await _context.SaveChangesAsync();
        }

    }
}
