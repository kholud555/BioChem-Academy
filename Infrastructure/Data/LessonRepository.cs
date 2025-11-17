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
    public class LessonRepository : ILessonRepository
    {
        private readonly StoreContext _context;

        public LessonRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<bool> UpdateIsFree (int lessonId, bool isFree)
        {
            var existLesson = await _context.Lessons.FindAsync(lessonId);
            if (existLesson == null) throw new KeyNotFoundException("Lesson not Found");

            existLesson.IsFree = isFree;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Lesson>> GetLessonsByUnitAsync(int unitId)
        {
            var lessons = await _context.Lessons
                .Where(l => l.UnitId == unitId)
                .Include(l => l.Unit)
                .OrderBy(l => l.Order)
                .ToListAsync();

            if (lessons.Count == 0) throw new KeyNotFoundException(nameof(lessons));
            return lessons;
        }

        public async Task<Lesson> GetLessonByIdAsync(int id)
        {
            var lesson = await _context.Lessons
                .Include(l => l.Unit)
                .FirstOrDefaultAsync(l => l.Id == id);

            if (lesson == null) throw new KeyNotFoundException("Lesson Not Found");
            return lesson;
        }

        public async Task<Lesson> AddLessonAsync(Lesson lesson)
        {
            var isUnitExist = await _context.Units.AnyAsync(u => u.Id == lesson.UnitId);
            if (!isUnitExist) throw new InvalidOperationException("Conflict: No Unit matches your input.");

            var isExisting = await _context.Lessons
                .AnyAsync(l => l.UnitId == lesson.UnitId && l.Order == lesson.Order);
            if (isExisting) throw new InvalidOperationException("conflict: lesson with this order already exists in the unit.");

            var newLesson = new Lesson
            {
                Title = lesson.Title,
                Description = lesson.Description,
                Order = lesson.Order,
                UnitId = lesson.UnitId
            };

            await _context.Lessons.AddAsync(newLesson);
            await _context.SaveChangesAsync();
            return newLesson;
        }

        public async Task<bool> UpdateLessonAsync(Lesson lesson)
        {
            var isUnitExist = await _context.Units.AnyAsync(u => u.Id == lesson.UnitId);
            if (!isUnitExist) throw new InvalidOperationException("Conflict: No Unit matches your input.");

            var existingLesson = await _context.Lessons.FindAsync(lesson.Id);
            if (existingLesson == null) return false;

            existingLesson.Title = lesson.Title;
            existingLesson.Description = lesson.Description;
            existingLesson.Order = lesson.Order;
            existingLesson.UnitId = lesson.UnitId;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteLessonAsync(int id)
        {
            var lesson = await _context.Lessons.FindAsync(id);
            if (lesson == null) return false;

            _context.Lessons.Remove(lesson);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
