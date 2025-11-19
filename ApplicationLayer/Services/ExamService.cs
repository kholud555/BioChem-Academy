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
    public class ExamService
    {
        private readonly IExamRepository _examRepo;
        private readonly IMapper _mapper;

        public ExamService(IExamRepository examRepo, IMapper mapper)
        {
            _examRepo = examRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Exam>> GetExamsByLessonAsync(int lessonId)
        {
            if (lessonId <= 0)
                throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");

            return await _examRepo.GetExamsByLessonAsync(lessonId);
        }

        public async Task<Exam> GetExamByIdAsync(int id)
        {
            if (id <= 0)
                throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");

            return await _examRepo.GetExamByIdAsync(id);
        }

        public async Task<Exam> CreateExamAsync(CreateExamDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "Exam should not be null");

            if (dto.ReferenceId <= 0)
                throw new ArgumentOutOfRangeException("ReferenceId Should Be Greater than 0");

            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Title cannot be empty", nameof(dto.Title));

            if (dto.TimeLimit <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.TimeLimit), "TimeLimit must be greater than zero");

            var exam = _mapper.Map<Exam>(dto);
            return await _examRepo.AddExamAsync(exam);
        }

        public async Task<bool> UpdateExamAsync(ExamDTO dto)
        {
            if (dto is null)
                throw new ArgumentNullException(nameof(dto), "Exam object cannot be null.");

            if (dto.Id <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.Id), "Exam ID must be greater than zero.");

            if (dto.ReferenceId <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.ReferenceId), "ReferenceId must be greater than zero.");

            if (string.IsNullOrWhiteSpace(dto.Title))
                throw new ArgumentException("Title cannot be empty", nameof(dto.Title));

            if (dto.TimeLimit <= 0)
                throw new ArgumentOutOfRangeException(nameof(dto.TimeLimit), "TimeLimit must be greater than zero.");

            var exam = _mapper.Map<Exam>(dto);

            var isUpdated = await _examRepo.UpdateExamAsync(exam);

            if (!isUpdated)
                throw new KeyNotFoundException($"Exam with ID {dto.Id} not found.");

            return true;
        }

        public async Task<bool> DeleteExamAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(id), "ID must be greater than zero");
            }

            return await _examRepo.DeleteExamAsync(id);
        }

        public async Task<IEnumerable<QuestionsOfExamDTO>> GetExamQuestionByExamIdAsync (int examId)
        {
            if (examId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(examId), "ID must be greater than zero");
            }

            var examQuestionList = await _examRepo.GetExamQuestionsByIdAsync(examId);

            return examQuestionList.Select(q => new QuestionsOfExamDTO
            {
                Id = q.Id,
                QuestionHeader = q.QuestionHeader,
                Mark = q.Mark,
                Type = q.Type,

                ChoicesOfQuestion = q.QuestionChoices.Select(qc => new ChoicesOfQuestionDTO
                {
                    Id = qc.Id,
                    ChoiceText = qc.ChoiceText,
                    IsCorrect = qc.IsCorrect,
                    QuestionId = qc.QuestionId
                }).ToList()
            });
        }
    }
}
