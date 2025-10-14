using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class TermService
    {
        private readonly ITermRepository _termRepo;

        public TermService(ITermRepository termRepo)
        {
            _termRepo = termRepo;
        }

        public async Task<IEnumerable<Term>> GetTermsByCourseAsync(int courseId)
            => await _termRepo.GetTermsByCourseAsync(courseId);

        public async Task<Term> GetTermByIdAsync(int id)
        {
            if(id <= 0) throw new ArgumentOutOfRangeException(nameof(id), "Id Should Be Greater than 0");
            return await _termRepo.GetTermByIdAsync(id);
        }

        public async Task<Term> CreateTermAsync(TermEnum TermName, int courseId)
        {
            var term = new Term { TermOrder = TermName, GradeId = courseId };
            return await _termRepo.AddTermAsync(term);
        }

        public async Task<bool> UpdateTermAsync(int id, TermEnum TermName)
        {
            var term = await _termRepo.GetTermByIdAsync(id);
            if (term == null) return false;

            term.TermOrder = TermName;
            return await _termRepo.UpdateTermAsync(term);
        }

        public async Task<bool> DeleteTermAsync(int id)
            => await _termRepo.DeleteTermAsync(id);
    }
}

