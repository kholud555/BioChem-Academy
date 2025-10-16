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

        public async Task<IEnumerable<Grade>> GetAllGradesAsync ()
        {
           var grades = await _context.Grades.ToListAsync();

            if (grades.Count == 0) throw new KeyNotFoundException(nameof(grades));

            return grades;
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
                throw new InvalidOperationException ("Conflict: Grade  name already exists.");
            var newGrade = new Grade { GradeName = gradeName};
            _context.Grades.Add(newGrade);
            await _context.SaveChangesAsync();
            return newGrade;
        }

        public async Task<bool> UpdateGradeNameAsync (Grade grade)
        {
            var existing =  await _context.Grades.FindAsync(grade.Id);
            if(existing == null) return false;

            existing.GradeName = grade.GradeName;
  
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteGradeAsync (int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null) return false;
            
            _context.Grades.Remove(grade);
           return await _context.SaveChangesAsync() > 0;
        }

    }
}
