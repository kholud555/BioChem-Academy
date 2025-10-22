using Application.DTOS;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class TermService
    {
        private readonly ITermRepository _termRepo;
        private readonly IMapper _mapper;

        public TermService(ITermRepository termRepo , IMapper mapper)
        {
            _termRepo = termRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Term>> GetTermsByGradeAsync(int courseId)
        {
            if(courseId <= 0) throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");
            return await _termRepo.GetTermsByGradeAsync(courseId);
        }
           

        public async Task<Term> GetTermByIdAsync(int id)
        {
            if(id <= 0) throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");
            return await _termRepo.GetTermByIdAsync(id);
        }

        public async Task<Term> CreateTermAsync(CreateTermDTO dto)
        {
            if(dto == null) throw new ArgumentNullException(nameof(dto) , "Term should not be null");
            if (dto.GradeId <= 0) throw new ArgumentException("term should have Grade");
            var term = _mapper.Map<Term> (dto);
            return await _termRepo.AddTermAsync(term);
        }

        public async Task<bool> UpdateTermAsync(TermDTO dto)
        {
            if(dto is null) 
                throw new ArgumentNullException(nameof(dto), "Term object cannot be null.");

            if (dto.Id <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.Id), "Term ID must be greater than zero.");

            if (dto.GradeId <= 0) 
                throw new ArgumentOutOfRangeException(nameof(dto.GradeId), "Grade ID must be greater than zero.");

            var term = _mapper.Map<Term>(dto);

            var isUpdated = await _termRepo.UpdateTermAsync(term);

            if (!isUpdated)
                throw new KeyNotFoundException($"Term with ID {dto.Id} not found.");

            return true;
        }

        public async Task<bool> DeleteTermAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(id), "ID must be greater than zero");
            }
            return await _termRepo.DeleteTermAsync(id);
        }
    }
}

