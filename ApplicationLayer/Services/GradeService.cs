using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class GradeService 
    {
        private readonly IGradeRepository _repo;
        public GradeService(IGradeRepository repo)
        {
           _repo = repo;
        }


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
            return await _repo.GetGradeByIdAsync(id);
        }


        public async Task<Grade> CreateGradeAsync(string gradeName)
        {

            if(String.IsNullOrWhiteSpace(gradeName)) throw new ArgumentNullException(nameof(gradeName), "Grade should not be null");

            return await _repo.CreateGradeAsync(gradeName);
            
        }

        public async Task<Grade> UpdateGradeAsync(Grade grade)
        {
            if (grade.Id <= 0)
                throw new ArgumentOutOfRangeException("Invalid Grade ID");

            if (String.IsNullOrWhiteSpace(grade.GradeName)) throw new ArgumentNullException(nameof(grade.GradeName), "Grade should not be null");
            return await _repo.UpdateGradeNameAsync(grade);
        }

        public async Task DeleteGradeAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentOutOfRangeException("Invalid Grade ID");
            await _repo.DeleteGradeAsync(id);

        }
    }
}
