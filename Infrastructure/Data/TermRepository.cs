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

        public async Task<IEnumerable<Term>> GetTermsByGradeAsync(int gradeId)
        {
            var terms = await _context.Terms
                .Where(t => t.GradeId == gradeId)
                .Include(t => t.Grade)
                .ToListAsync();

            if(terms.Count == 0) throw new KeyNotFoundException(nameof(terms));

            return terms;
        }

        public async Task<Term> GetTermByIdAsync(int id)
        {
            var term = await _context.Terms.Include(t => t.Grade).FirstOrDefaultAsync(t => t.Id == id);
            if(term == null) throw new KeyNotFoundException("Term Not Found");
            return term;
        }

        public async Task<Term> AddTermAsync(Term term)
        {
            var isGradeExist = await _context.Grades.AnyAsync(g => g.Id == term.GradeId);

            if(!isGradeExist)  throw new InvalidOperationException("Conflict: No Grade matches your input.");

            var isExisting = await _context.Terms.
                AnyAsync(t => t.GradeId == term.GradeId && t.TermOrder == term.TermOrder);

            if (isExisting) throw new InvalidOperationException("conflict: term already exists.");

            var newTerm = new Term
            {
                TermOrder = term.TermOrder,
                GradeId = term.GradeId,
            };
                                 
            _context.Terms.Add(newTerm);
            await _context.SaveChangesAsync();
            return newTerm;
        }

        public async Task<bool> UpdateTermAsync(Term term)
        {
            var existingTerm = await _context.Terms.FindAsync(term.Id);
            if(existingTerm == null) return false;

            existingTerm.TermOrder = term.TermOrder;
            existingTerm.GradeId = term.GradeId;

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
