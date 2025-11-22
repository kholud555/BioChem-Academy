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
    public class SubjectRepository : ISubjectRepository
    {
        private readonly StoreContext _context;

        public SubjectRepository(StoreContext context)
        {
            _context = context;
        }

        public async  Task<Subject> GetSubjectByIdAsync(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null)
                throw new KeyNotFoundException("Subject Not Found");

            return subject;
        }
        public async Task<Subject> CreateSubjectAsync(string subjectName)
        {
            var isSubjectExist = await _context.Subjects.AnyAsync(s => s.SubjectName == subjectName);
            if (isSubjectExist) throw new InvalidOperationException("Conflict: Subject name already exists.");

            var newSubject = new Subject { SubjectName = subjectName };
            await _context.Subjects.AddAsync(newSubject);
            await _context.SaveChangesAsync();

            return newSubject;
        }

        public async Task<IEnumerable<Subject>> GetAllSubjectsAsync()
        {
            var subjects = await _context.Subjects.ToListAsync();

            if (subjects.Count == 0) throw new KeyNotFoundException(nameof(subjects));

            return subjects;
        }

        public async Task<bool> UpdateSubjectNameAsync(Subject subject)
        {
            var existing = await _context.Subjects.FindAsync(subject.Id);
            if (existing == null) return false;

            existing.SubjectName = subject.SubjectName;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteSubjectAsync(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return false;

            _context.Subjects.Remove(subject);
            return await _context.SaveChangesAsync() > 0;
        }

    }
}
