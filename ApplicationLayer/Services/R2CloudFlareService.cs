using Amazon.S3;
using Amazon.S3.Model;
using Application.DTOS;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Application.Services
{
    public class R2CloudFlareService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;
        private readonly StoreContext _context;

        public R2CloudFlareService( IConfiguration config , StoreContext context)
        {
            //Creates a configuration object for the S3 client 
            var s3Config = new AmazonS3Config
            {
               ServiceURL = config["R2:Endpoint"],
                //tells the SDK to use path-style URLs
                ForcePathStyle =  true
            };

            //This client is what actually connects to Cloudflare R2 and performs all actions (upload, get, delete, etc).
            _s3Client = new AmazonS3Client
                (
                config["R2:AccessKey"] ,
                config["R2:SecretKey"],
                s3Config
                );

            _bucketName = config["R2:BucketName"]!;
            _context = context;
        }


        //Creates a temporary(signed) URL for viewing or streaming a file to student
        public string GenerateSignedUrlForViewing (string filePathInBucket , int expireMinutes = 5)
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
            var isExistLesson = await _context.Lessons.AnyAsync(l => l.Id == lessonId);
            if(!isExistLesson) throw new KeyNotFoundException("Lesson with this Id not exist");

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
    }
}
