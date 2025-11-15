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
        public async Task<QuestionChoice> AddQuestionChoicesAsync(CreateQuestionChoicesDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Question object cannot be null.");
            if (string.IsNullOrWhiteSpace(dto.ChoiceText))
                throw new ArgumentException("Question choice cannot be empty.");
            if (dto.QuestionId <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.QuestionId), "Question ID must be greater than zero.");

            var questionChoice = _mapper.Map<QuestionChoice>(dto);

            var newQuestionChoice = await _repo.AddQuestionChoicesAsync(questionChoice);
            if (newQuestionChoice == null) throw new InvalidOperationException("Conflict : Question choice did not created");

            return newQuestionChoice;
        }
        public async Task<Question> AddQuestionHeaderAsync(CreateQuestionDTO dto)
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
             var newQuestion = await _repo.AddQuestionHeaderAsync(question);
            if (newQuestion == null) throw new InvalidOperationException("Conflict : Question did not created");

            return newQuestion;
        }
        public async Task<bool> UpdateQuestionHeaderAsync (QuestionDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Question object cannot be null.");
            if (string.IsNullOrWhiteSpace(dto.QuestionHeader))
                throw new ArgumentException("Question header cannot be empty.");
            if (dto.ExamId <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.ExamId), "Exam ID must be greater than zero.");
            if (dto.Id <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.Id), "Question ID must be greater than zero.");
            if (dto.Mark <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.Mark), "Mark must be greater than zero.");

            var question = _mapper.Map<Question>(dto);
            var isUpdated = await _repo.UpdateQuestionHeaderAsync(question);
            if (! isUpdated) throw new InvalidOperationException("Conflict : Question did not Updated");

            return isUpdated;
        }
        public async Task<bool> UpdateQuestionChoiceAsync (QuestionChoicesDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Question object cannot be null.");
            if (string.IsNullOrWhiteSpace(dto.ChoiceText))
                throw new ArgumentException("Question choice cannot be empty.");
            if (dto.QuestionId <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.QuestionId), "Question ID must be greater than zero.");
            if (dto.Id <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.Id), "Question ID must be greater than zero.");

            var questionChoice = _mapper.Map<QuestionChoice>(dto);

            var isUpdated = await _repo.UpdateQuestionChoiceAsync(questionChoice);
            if (!isUpdated) throw new InvalidOperationException("Conflict : Question choice did not Updated");

            return isUpdated;
        }
        public async Task<bool> DeleteQuestionAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentOutOfRangeException(nameof(id), "ID must be greater than zero.");

            return await _repo.DeleteQuestionAsync(id);
        }
    }
}
