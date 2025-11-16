using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IQuestionRepository
    {
        Task<Question> AddQuestionHeaderAsync(Question question);
        Task<QuestionChoice> AddQuestionChoicesAsync(QuestionChoice choice);
        Task<bool> UpdateQuestionHeaderAsync(Question question);
        Task<bool> DeleteQuestionAsync(int questionId);
        Task<bool> UpdateQuestionChoiceAsync(QuestionChoice choice);

        Task<Question?> GetQuestionById(int questionId);
    }
}
