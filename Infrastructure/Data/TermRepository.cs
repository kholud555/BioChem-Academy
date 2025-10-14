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
   public class TermRepository : ITermRepository
   {
        private readonly StoreContext _context;

        public TermRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Term>> GetTermsByCourseAsync(int courseId)
        {
            return await _context.Terms
                .Where(t => t.GradeId == courseId)
                .Include(t => t.Grade)
                .ToListAsync();
        }

        public async Task<Term> GetTermByIdAsync(int id)
        {
            var term = await _context.Terms.Include(t => t.Grade).FirstOrDefaultAsync(t => t.Id == id);
            if(term == null) throw new KeyNotFoundException("Term Not Found");
            return term;
        }

        public async Task<Term> AddTermAsync(Term term)
        {
            var isExisting = _context.Terms.
                Any(t => t.GradeId == term.GradeId
                && (t.TermOrder == TermEnum.TermOne || t.TermOrder == TermEnum.TermTwo)
                && t.TermOrder == term.TermOrder);

            if (isExisting) throw new InvalidOperationException("conflict term already exists");

            var newTerm = new Term
            {
                TermOrder = term.TermOrder,
                IsFree = term.IsFree,
                IsPublished = term.IsPublished,
                GradeId = term.GradeId,
            };
                                 
            _context.Terms.Add(newTerm);
            await _context.SaveChangesAsync();
            return term;
        }

        public async Task<bool> UpdateTermAsync(Term term)
        {
            _context.Terms.Update(term);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteTermAsync(int id)
        {
            var term = await _context.Terms.FindAsync(id);
            if (term == null) return false;

            _context.Terms.Remove(term);
            return await _context.SaveChangesAsync() > 0;
        }

    }
}
