using Application.DTOS;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class GradeService 
    {
        private readonly IGradeRepository _gradeRepo;

        public GradeService(IGradeRepository gradeRepo)
        {
            _gradeRepo = gradeRepo;
        }

        public async Task<IEnumerable<Grade>> GetDistinctGrades()
        => await _gradeRepo.GetDistinctGrades();

        private void CheckIdValidation  (int id)
        {
            if (id <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(id), "ID must be greater than zero");
            }
        }

        public async Task<Grade> GetGradeByIdAsync(int id)
        {
            CheckIdValidation(id);
            return await _gradeRepo.GetGradeByIdAsync(id);
        }
        public async Task<Grade> CreateGradeAsync(string gradeName , int subjectId)
        {

            if(String.IsNullOrWhiteSpace(gradeName)) throw new ArgumentNullException(nameof(gradeName), "Grade should not be null");

            return await _gradeRepo.CreateGradeAsync(gradeName , subjectId);
            
        }

        public async Task<bool> UpdateGradeAsync(Grade grade)
        {
            if(grade is null) 
                throw new ArgumentNullException(nameof(grade), "Grade object cannot be null.");

            if (grade.Id <= 0)
                throw new ArgumentOutOfRangeException("Invalid Grade ID");

            if (grade.SubjectId <= 0)
                throw new ArgumentOutOfRangeException("Invalid Subject ID");

            if (String.IsNullOrWhiteSpace(grade.GradeName))
                throw new ArgumentNullException(nameof(grade.GradeName),"Grade name should not be null");

            var isUpdated = await _gradeRepo.UpdateGradeNameAsync(grade);
            if(!isUpdated) 
                throw new KeyNotFoundException($"Grade with ID {grade.Id} not found.");

            return true;
        }

        public async Task<bool> DeleteGradeAsync(int id)
        {
            CheckIdValidation(id);

           return await _gradeRepo.DeleteGradeAsync(id);
        }

        public async Task<IEnumerable<Grade>> GetAllGradeAsync ()
        => await _gradeRepo.GetAllGradesAsync();

        public async Task<IEnumerable<Grade>> GetGradeBySubjectIdAsync(int subjectId)
        {
            if (subjectId <= 0)
                throw new ArgumentOutOfRangeException("Invalid Subject ID");

            return await _gradeRepo.GetGradeBySubjectIdAsync(subjectId);
        }


        
    }
}
