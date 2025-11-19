using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IExamRepository
    {
        Task<IEnumerable<Exam>> GetExamsByLessonAsync(int lessonId);
        Task<Exam> GetExamByIdAsync(int id);
        Task<Exam> AddExamAsync(Exam exam);
        Task<bool> UpdateExamAsync(Exam exam);
        Task<bool> DeleteExamAsync(int id);
        Task<IEnumerable<Question>> GetExamQuestionsByIdAsync (int examId);
    }
}
