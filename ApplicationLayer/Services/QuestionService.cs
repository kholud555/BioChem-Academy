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
    public class QuestionService
    {
        private readonly IQuestionRepository _repo;
        private readonly IMapper _mapper;

        public QuestionService(IQuestionRepository repo ,IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<Question> GetQuestionByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentOutOfRangeException(nameof(id), "Question ID must be greater than zero.");

            var question = await _repo.GetQuestionById(id);
            if (question == null)
                throw new KeyNotFoundException($"Question with ID {id} not found.");

            return question;

        }


        public async Task<Question> SaveQuestionAsync(CreateQuestionDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Question object cannot be null.");
            if (string.IsNullOrWhiteSpace(dto.QuestionHeader))
                throw new ArgumentException("Question header cannot be empty.");
            if (dto.ExamId <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.ExamId), "Exam ID must be greater than zero.");
            if (dto.Mark <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.Mark), "Mark must be greater than zero.");

            var question = _mapper.Map<Question>(dto);

            //if (dto.Id == null || dto.Id == 0)
            //    return await _repo.AddQuestionHeaderAsync(question);

            //var isUpdated = await _repo.UpdateQuestionAsync(question);
            //if (!isUpdated)
            //    throw new KeyNotFoundException($"Question with ID {dto.Id} not found.");

            return question;
        }


        public async Task<bool> DeleteQuestionAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentOutOfRangeException(nameof(id), "ID must be greater than zero.");

            return await _repo.DeleteQuestionAsync(id);
        }
    }
}
