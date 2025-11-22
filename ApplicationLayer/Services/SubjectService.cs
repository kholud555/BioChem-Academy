using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class SubjectService
    {
        private readonly ISubjectRepository _repo;

        public SubjectService(ISubjectRepository repo)
        {
            _repo = repo;
        }

        private void CheckIdValidation(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(id), "ID must be greater than zero");
            }
        }

        public async Task<Subject> GetSubjectByIdAsync(int id)
        {
            CheckIdValidation(id);
            return await _repo.GetSubjectByIdAsync(id);
        }
        public async Task<Subject> CreateSubjectAsync(string subjectName)
        {

            if (String.IsNullOrWhiteSpace(subjectName)) throw new ArgumentNullException(nameof(subjectName), "Subject should not be null");

            return await _repo.CreateSubjectAsync(subjectName);

        }

        public async Task<bool> UpdateSubjectAsync(Subject subject)
        {
            if (subject is null)
                throw new ArgumentNullException(nameof(subject), "Subject object cannot be null.");

            if (subject.Id <= 0)
                throw new ArgumentOutOfRangeException("Invalid subject ID");

            if (String.IsNullOrWhiteSpace(subject.SubjectName))
                throw new ArgumentNullException(nameof(subject.SubjectName), "Subject name should not be null");

            var isUpdated = await _repo.UpdateSubjectNameAsync(subject);
            if (!isUpdated)
                throw new KeyNotFoundException($"Subject with ID {subject.Id} not found.");

            return true;
        }

        public async Task<IEnumerable<Subject>> GetAllSubjectsAsync()
       => await _repo.GetAllSubjectsAsync();

        public async Task<bool> DeleteSubjectAsync(int id)
        {
            CheckIdValidation(id);

            return await _repo.DeleteSubjectAsync(id);
        }
    }
}
