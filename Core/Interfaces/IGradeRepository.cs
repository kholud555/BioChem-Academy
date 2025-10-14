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

        Task<Grade> CreateGradeAsync(string gradeName);

        Task<Grade> UpdateGradeNameAsync(Grade grade);

        Task DeleteGradeAsync(int id);
    }
}
