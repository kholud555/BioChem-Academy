using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class MediaRepository : IMediaRepository
    {
        private readonly StoreContext _context;

        public MediaRepository(StoreContext context)
        {
            _context = context;
        }
        public async Task<Media> AddMediaAsync(Media media)
        {
            var isMediaExist = await _context.Medias.AnyAsync(m => m.Id == media.Id);
            if(isMediaExist) throw new InvalidOperationException("Conflict: Media is Already Exist");

            var isLessonExist = await _context.Lessons.AnyAsync(l => l.Id == media.LessonId);
            if(!isLessonExist) throw new InvalidOperationException("Conflict: No Lesson with this Id");

            var isMediaPathExist = await _context.Medias.AnyAsync(m => m.StorageKey == media.StorageKey);
            if (isMediaPathExist) throw new InvalidOperationException("Conflict: File with this path and name already exist");

            var newMedia = new Media
            {
                MediaType = media.MediaType,
                StorageKey = media.StorageKey,
                FileFormat = media.FileFormat,
                LessonId = media.LessonId,
                Duration = media.Duration, 
            };

            _context.Medias.Add(newMedia);
           await _context.SaveChangesAsync();

            return newMedia;
        }

     
    }
}
