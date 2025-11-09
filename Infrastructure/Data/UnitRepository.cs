using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class UnitRepository : IUnitRepository
    {
        private readonly StoreContext _context;
        public UnitRepository(StoreContext context) 
        {
            _context = context;
        }

        public async Task<Unit> GetUnitByIdAsync(int id)
        {
            var unit = await _context.Units.FindAsync(id);

            if(unit is null) throw new KeyNotFoundException(nameof(unit));

            return unit;
        }
        public async Task<Unit> AddUnitAsync(Unit unit)
        {
            var isTermExist = await _context.Terms.AnyAsync(t => t.Id == unit.TermId);
            if (!isTermExist) throw new InvalidOperationException("Conflict: No Term matches your input.");

            var isExistedUnit = await _context.Units.AnyAsync(u => u.Title == unit.Title);
            if(isExistedUnit) throw new InvalidOperationException("conflict: Unit already exists.");

            var newUnit = new Unit
            {
                Title = unit.Title,
                Description = unit.Description,
                Order = unit.Order,
                TermId = unit.TermId,
            };

            await _context.Units.AddAsync(newUnit);
            _context.SaveChanges();
            return newUnit;
        }
        public async Task<bool> UpdateUnitAsync(Unit unit)
        {
            var existingUnit = await _context.Units.FindAsync(unit.Id);
            if(existingUnit is null) return false;

            existingUnit.Title = unit.Title;
            existingUnit.Description = unit.Description;
            existingUnit.Order = unit.Order;
            existingUnit.TermId = unit.TermId;

            return await _context.SaveChangesAsync() > 0;
        }
     public async Task<bool> DeleteUnitAsync(int id)
     {
           var existingUnit = await _context.Units.FindAsync(id); 
            if(existingUnit is null) return false;

            _context.Units.Remove(existingUnit);

            return _context.SaveChanges() > 0;
     }

    }

  
}
