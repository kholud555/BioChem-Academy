using Application.DTOS;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class UnitService
    {
        private readonly IUnitRepository _unitRepo;
        private readonly IMapper _mapper;

        public UnitService(IUnitRepository unitRepo, IMapper mapper)
        {
            _unitRepo = unitRepo;
            _mapper = mapper;
        }

        public async Task<Unit> GetUnitByIdAsync (int id)
        {
            if(id <= 0) throw new ArgumentOutOfRangeException(nameof(id), "Id Should Be Greater than 0");

            return await _unitRepo.GetUnitByIdAsync(id);
        }

        public async Task<Unit> createUnitAsync (CreateUnitDTO dto)
        {
            if(dto is null) throw new ArgumentNullException(nameof(dto), "Unit should not be null.");

            var unit = _mapper.Map<Unit>(dto);

            return await _unitRepo.AddUnitAsync(unit);
        }

        public async Task<bool> UpdateUnitAsync(UnitDTO dto)
        {
            if (dto is null)
                throw new ArgumentNullException(nameof(dto), "Unit object cannot be null.");

            if (dto.Id <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.Id), "Unit ID must be greater than zero.");


            var unit = _mapper.Map<Unit>(dto);
            var isUpdated = await _unitRepo.UpdateUnitAsync(unit);

            if (!isUpdated)
                throw new KeyNotFoundException($"Unit with ID {dto.Id} not found.");

            return true;
        }

        public async Task<bool> DeleteUnitAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(id), "ID must be greater than zero");
            }
            return await _unitRepo.DeleteUnitAsync(id);
        }

        public async Task<IEnumerable<Unit>> GetUnutsByTermId(int termId) {
         if (termId <= 0) {
                throw new ArgumentOutOfRangeException(nameof(termId), "ID must be greater than zero");
            } 
         
         var unitsOfTerm =  await _unitRepo.GetUnitsByTermIdAsync(termId);

        if (!unitsOfTerm.Any()) throw new ArgumentException("no units to this term");


            return unitsOfTerm;


        }
    }
}
