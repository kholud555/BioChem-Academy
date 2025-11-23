using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IGradeRepository
    {
        Task<Grade> GetGradeByIdAsync (int id);

        Task<Grade> CreateGradeAsync(string gradeName, int subjectId);

        Task<bool> UpdateGradeNameAsync(Grade grade);

        Task<bool> DeleteGradeAsync(int id);

        Task<IEnumerable<Grade>> GetAllGradesAsync();

        Task<IEnumerable<Grade>> GetGradeBySubjectIdAsync(int subjectId);
    }
}
