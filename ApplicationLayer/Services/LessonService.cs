using Application.DTOS;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class LessonService
    {
        private readonly ILessonRepository _lessonRepo;
        private readonly IMapper _mapper;

        public LessonService(ILessonRepository lessonRepo, IMapper mapper)
        {
            _lessonRepo = lessonRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Lesson>> GetLessonsByUnitAsync(int unitId)
        {
            if (unitId <= 0) throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");
            return await _lessonRepo.GetLessonsByUnitAsync(unitId);
        }

        public async Task<Lesson> GetLessonByIdAsync(int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");
            return await _lessonRepo.GetLessonByIdAsync(id);
        }

        public async Task<Lesson> CreateLessonAsync(CreateLessonDTO dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto), "Lesson should not be null");
            if (dto.UnitId <= 0) throw new ArgumentException("lesson should have Unit");
            if (string.IsNullOrWhiteSpace(dto.Title)) throw new ArgumentException("lesson should have Title");

            var lesson = _mapper.Map<Lesson>(dto);
            return await _lessonRepo.AddLessonAsync(lesson);
        }

        public async Task<bool> UpdateLessonAsync(LessonDTO dto)
        {
            if (dto is null)
                throw new ArgumentNullException(nameof(dto), "Lesson object cannot be null.");
            if (dto.Id <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.Id), "Lesson ID must be greater than zero.");
            if (dto.UnitId <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.UnitId), "Unit ID must be greater than zero.");
            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Title cannot be empty.", nameof(dto.Title));

            var lesson = _mapper.Map<Lesson>(dto);
            var isUpdated = await _lessonRepo.UpdateLessonAsync(lesson);
            if (!isUpdated)
                throw new KeyNotFoundException($"Lesson with ID {dto.Id} not found.");
            return true;
        }

        public async Task<bool> DeleteLessonAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(id), "ID must be greater than zero");
            }
            return await _lessonRepo.DeleteLessonAsync(id);
        }
    }
}
