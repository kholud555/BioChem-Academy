using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ISubjectRepository
    {
        Task<Subject> GetSubjectByIdAsync(int id);

        Task<Subject> CreateSubjectAsync(string subjectName);

        Task<bool> UpdateSubjectNameAsync(Subject subject);

        Task<bool> DeleteSubjectAsync(int id);

        Task<IEnumerable<Subject>> GetAllSubjectsAsync();
    }
}
