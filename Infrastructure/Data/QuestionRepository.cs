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
    public class QuestionRepository : IQuestionRepository
    {
        private readonly StoreContext _context;

        public QuestionRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<Question?> GetQuestionById (int id)
        => await _context.Questions.FindAsync(id);

        public async Task<Question> AddQuestionHeaderAsync(Question question)
        {
            var examExist = await _context.Exams.AnyAsync(e => e.Id == question.ExamId);
            if (!examExist) throw new KeyNotFoundException("Exam not found");

            var isDuplicate = await _context.Questions
                                  .AnyAsync(q => q.QuestionHeader == question.QuestionHeader
                               && q.ExamId == question.ExamId);
            if (isDuplicate) 
                throw new InvalidOperationException("Conflict: Question with the same text already exists in this exam.");


            var newQuestion = new Question
            {
                QuestionHeader = question.QuestionHeader,
                Mark = question.Mark,
                Type = question.Type,
                ExamId = question.ExamId,
            };

            await _context.Questions.AddAsync(newQuestion);
            await _context.SaveChangesAsync();
            return newQuestion;
        }

        public async Task<QuestionChoice> AddQuestionChoicesAsync(QuestionChoice choice)
        {
            var question = await _context.Questions
                           .Include(q => q.QuestionChoices)
                           .FirstOrDefaultAsync(q => q.Id == choice.QuestionId);
            if (question == null) throw new KeyNotFoundException("Question for this choice not found");

            var choicesCount = question.QuestionChoices.Count;

            if (choicesCount != 0)
            {

                if (question.Type == ExamTypeEnum.ChoiceType && choicesCount >= 4)

                    throw new ArgumentException("Multi choices question only has 4 answers");


                if (question.Type == ExamTypeEnum.TrueFalseType && choicesCount >= 2)

                    throw new InvalidOperationException("True or false question only has 2 answers");
            }
            
            var hasCorrectAnswer = question.QuestionChoices.Any(c => c.IsCorrect);

            if(hasCorrectAnswer && choice.IsCorrect)
                throw new InvalidOperationException("Conflict : This question already has a correct answer.");


            var newChoice = new QuestionChoice
            {
                ChoiceText = choice.ChoiceText,
                QuestionId = choice.QuestionId,
                IsCorrect = choice.IsCorrect,
            };

            await _context.QuestionChoices.AddAsync(newChoice);
            await _context.SaveChangesAsync();

            return newChoice;
        }

        public async Task<bool> DeleteQuestionAsync(int questionId)
        {
            var question = await _context.Questions
                          .Include(q => q.QuestionChoices)
                          .FirstOrDefaultAsync(q => q.Id == questionId);
            if (question == null)
                throw new KeyNotFoundException("Question not found");

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateQuestionHeaderAsync(Question question)
        {
            var existedQuestion = await _context.Questions
                        .FirstOrDefaultAsync(q => q.Id == question.Id);

            if (existedQuestion == null)
                throw new KeyNotFoundException("Question not found");

            existedQuestion.QuestionHeader = question.QuestionHeader;
            existedQuestion.Type = question.Type;
            existedQuestion.Mark = question.Mark;

            _context.Questions.Update(existedQuestion);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateQuestionChoiceAsync(QuestionChoice choice)
        {
            var existedChoiceQuestion = await _context.QuestionChoices
                        .FirstOrDefaultAsync(c => c.Id == choice.Id);

            if (existedChoiceQuestion == null)
                throw new KeyNotFoundException("Question not found");

            existedChoiceQuestion.ChoiceText = choice.ChoiceText;
            existedChoiceQuestion.IsCorrect = choice.IsCorrect;

            _context.QuestionChoices.Update(existedChoiceQuestion);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
