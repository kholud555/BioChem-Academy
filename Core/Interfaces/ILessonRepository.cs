using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ILessonRepository
    {
        Task<IEnumerable<Lesson>> GetLessonsByUnitAsync(int unitId);
        Task<Lesson> GetLessonByIdAsync(int id);
        Task<Lesson> AddLessonAsync(Lesson lesson);
        Task<bool> UpdateLessonAsync(Lesson lesson);
        Task<bool> DeleteLessonAsync(int id);
        Task<bool> UpdateIsFree(int lessonId, bool isFree);

    }
}
