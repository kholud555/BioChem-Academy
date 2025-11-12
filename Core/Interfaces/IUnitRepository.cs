using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IUnitRepository
    {
        //Task<IEnumerable<Unit>> GetAllUnitsAsync();
        Task<Unit> GetUnitByIdAsync(int id);
        Task<Unit> AddUnitAsync(Unit unit);
        Task<bool> UpdateUnitAsync(Unit unit);
        Task<bool> DeleteUnitAsync(int id);

        Task<IEnumerable<Unit>> GetUnitsByTermIdAsync(int termId);
    }
}
