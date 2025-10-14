using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ITermRepository
    {
        Task<IEnumerable<Term>> GetTermsByCourseAsync(int courseId);
        Task<Term> GetTermByIdAsync(int id);
        Task<Term> AddTermAsync(Term term);
        Task<bool> UpdateTermAsync(Term term);
        Task<bool> DeleteTermAsync(int id);
    }
}
