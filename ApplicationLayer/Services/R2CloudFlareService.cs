using Amazon.S3;
using Amazon.S3.Model;
using Application.DTOS;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Application.Services
{
    public class R2CloudFlareService
    {
        #region Fields
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly StoreContext _context;
        private readonly IStudentRepository _studentRepo;
        private readonly ILessonRepository _lessonRepo;
        private readonly IAccessControlRepository _controlRepo;
        #endregion

        #region Constructor
        public R2CloudFlareService(IConfiguration config, StoreContext context,
            IStudentRepository studentRepo, ILessonRepository lessonRepo,
            IAccessControlRepository controlRepo)
        {
            //Creates a configuration object for the S3 client 
            var s3Config = new AmazonS3Config
            {
                ServiceURL = config["R2:Endpoint"],
                //tells the SDK to use path-style URLs
                ForcePathStyle = true
            };

            //This client is what actually connects to Cloudflare R2 and performs all actions (upload, get, delete, etc).
            _s3Client = new AmazonS3Client
                (
                config["R2:AccessKey"],
                config["R2:SecretKey"],
                s3Config
                );

            _bucketName = config["R2:BucketName"]!;
            _context = context;
            _studentRepo = studentRepo;
            _lessonRepo = lessonRepo;
            _controlRepo = controlRepo;
        }

        #endregion

        //Creates a temporary(signed) URL for viewing or streaming a file to student
        private string GenerateSignedUrlForViewing (string filePathInBucket , int expireMinutes = 5)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = filePathInBucket,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(expireMinutes)
            };

            return _s3Client.GetPreSignedURL(request);
        }

        //Generates a temporary upload link for Admin To Upload Data to CloudFlare from Frontend
        public string GenerateUrlToUploadFiles (string filePathInBucket , int expireMinutes = 5)
        {
            var lessonId = filePathInBucket.Split('/')[3];

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = filePathInBucket,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(expireMinutes)
            };

            return _s3Client.GetPreSignedURL(request);
        }

        public async Task<bool> DeleteMediaAsync(int mediaId)
        {
            if(mediaId <= 0) throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");

            var existedMedia = await _context.Medias.FindAsync(mediaId);
            if (existedMedia == null) throw new KeyNotFoundException("Media not found");

            var deleteRequest = new DeleteObjectRequest
            {
                BucketName= _bucketName,
                Key = existedMedia.StorageKey
            };


            var response = await _s3Client.DeleteObjectAsync(_bucketName, existedMedia.StorageKey);

            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK 
             && 
                 response.HttpStatusCode != System.Net.HttpStatusCode.NoContent)
             throw new ArgumentException($"Failed to delete file from Cloudflare R2. Status: {response.HttpStatusCode}");

            _context.Medias.Remove(existedMedia);
            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
                throw new InvalidOperationException("Media was deleted from Cloudflare but not removed from database");

            return true;
        }

        public async Task<IEnumerable<MediaAdminDTO>> GetMediaByLessonIdAsync (int  lessonId)
        {
            var lesson = await _lessonRepo.GetLessonByIdAsync(lessonId);

            var MediaOfLesson = await _context.Medias.Where(m => m.LessonId == lessonId)
                .Select(m => new 
                {
                    m.Id,
                    m.FileFormat,
                    m.MediaType,
                    m.Duration,
                    m.StorageKey  
                }).ToListAsync();

            var result = new List<MediaAdminDTO>();
            foreach(var m in MediaOfLesson)
            {
                var Url = GenerateSignedUrlForViewing(m.StorageKey);

                result.Add(new MediaAdminDTO
                {
                    Id = m.Id,
                    MediaType = m.MediaType.ToString(),
                    FileFormat = m.FileFormat.ToString(),
                    Duration = m.Duration,
                    FileName = Path.GetFileName(m.StorageKey),
                    PreviewUrl = Url

                });
            }

            return result;
        }

        private async Task<List<StudentAccessedMediaDTo>> GetMediaOfLessonAsync (int lessonId)
        {
            var result = new List<StudentAccessedMediaDTo>();
            var MediaOfLesson = await _context.Medias.Where(m => m.LessonId == lessonId)
                .Select(m => new
                {
                    m.FileFormat,
                    m.MediaType,
                    m.Duration,
                    m.StorageKey
                }).ToListAsync();


            foreach (var m in MediaOfLesson)
            {
                var Url = GenerateSignedUrlForViewing(m.StorageKey, 1);

                result.Add(new StudentAccessedMediaDTo
                {
                    MediaType = m.MediaType.ToString(),
                    FileFormat = m.FileFormat.ToString(),
                    Duration = m.Duration,
                    FileName = Path.GetFileName(m.StorageKey),
                    PreviewUrl = Url

                });
            }

            return result;
        }
        public async Task<IEnumerable<StudentAccessedMediaDTo>?> GetMedioForStudentByLessonIdAsync (string userId , int lessonId)
        {
            if (String.IsNullOrWhiteSpace(userId)) throw new ArgumentNullException("Id must be provided");

            if (!int.TryParse(userId, out var studentId))
            {
                throw new UnauthorizedAccessException("Invalid or missing student ID claim.");
            }

            var student = await _studentRepo.GetStudentByIdAsync(studentId);

            var lesson = await _lessonRepo.GetLessonByIdAsync(lessonId);

            var permissions = await _controlRepo.GetStudentPermissionsAsync(student.Id);
            var lessonGranted = new HashSet<int>(permissions.Where(a => a.LessonId.HasValue).Select(a => a.LessonId!.Value));
            var unitGranted = new HashSet<int>(permissions.Where(a => a.UnitId.HasValue).Select(a => a.UnitId!.Value));
            var termGranted = new HashSet<int>(permissions.Where(a => a.TermId.HasValue).Select(a => a.TermId!.Value));
            var gradeGranted = new HashSet<int>(permissions.Where(a => a.GradeId.HasValue).Select(a => a.GradeId!.Value));

            // 1) Direct lesson access?
            if (lessonGranted.Contains(lessonId))
                return await GetMediaOfLessonAsync(lessonId);

            // 2) Unit access? If unit not found -> treat as no access and continue
            var unit = await _context.Units
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == lesson.UnitId);

            if (unit != null && unitGranted.Contains(unit.Id))
                return await GetMediaOfLessonAsync(lessonId);

            // 3) Term access? If term not found -> treat as no access and continue
            int? termId = unit?.TermId;
            Term? term = null;
            if (termId.HasValue)
            {
                term = await _context.Terms
                    .AsNoTracking()
                    .FirstOrDefaultAsync(t => t.Id == termId.Value);

                if (term != null && termGranted.Contains(term.Id))
                    return await GetMediaOfLessonAsync(lessonId);
            }

            // 4) Grade access? If grade not found -> no access
            int? gradeId = term?.GradeId;
            if (gradeId.HasValue)
            {
                var grade = await _context.Grades
                    .AsNoTracking()
                    .FirstOrDefaultAsync(g => g.Id == gradeId.Value);

                if (grade != null && gradeGranted.Contains(grade.Id))
                    return await GetMediaOfLessonAsync(lessonId);
            }


            return null;
        }

        // File: Services/ContentService.cs
        public async Task<IEnumerable<FreeContentDTO>> GetAllFreeContentAsync()
        {
           
            var data = await _context.Medias
                .Where(m => m.Lesson.IsFree)
                .Select(m => new
                {
                    LessonId = m.Lesson.Id,
                    LessonTitle = m.Lesson.Title,
                    m.StorageKey,
                    m.FileFormat,
                    m.MediaType,
                    m.Duration
                })
                .ToListAsync(); 

            if (data == null || data.Count == 0)
                throw new KeyNotFoundException("No free lessons available");

          
            var grouped = data.GroupBy(d => d.LessonId);

            var separators = new[] { '/', '\\' }; 

            var result = grouped.Select(g =>
            {
                var sample = g.First();

                
                var parts = (sample.StorageKey ?? string.Empty)
                    .Split(separators, StringSplitOptions.RemoveEmptyEntries);

                var subject = parts.ElementAtOrDefault(0) ?? string.Empty;
                var grade = parts.ElementAtOrDefault(1) ?? string.Empty;
                var term = parts.ElementAtOrDefault(2) ?? string.Empty;
                var unit = parts.ElementAtOrDefault(3) ?? string.Empty;

                return new FreeContentDTO
                {
                    SubjectName = subject,
                    GradeName = grade,
                    Term = term,
                    UnitName = unit,
                    LessonName = sample.LessonTitle ?? string.Empty,
                    MediaOfFreeLesson = g.Select(m => new StudentAccessedMediaDTo
                    {
                        FileName = Path.GetFileName(m.StorageKey ?? string.Empty),
                        FileFormat = m.FileFormat.ToString(),
                        MediaType = m.MediaType.ToString(),
                        Duration = m.Duration,
                        PreviewUrl = GenerateSignedUrlForViewing(m.StorageKey) 
                    }).ToList()
                };
            }).ToList();

            return result;
        }

        public async Task<string>  UploadVideoInHome ()
        {
            var link = GenerateUrlToUploadFiles("MediaForHome");

            return link;
        }


        public async Task<string> ViewVideoInHome()
        {
            var link = GenerateSignedUrlForViewing("MediaForHome");

            return link;
        }

    }
}
