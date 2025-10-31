using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;

namespace Application.Services
{
    public class R2CloudFlareService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public R2CloudFlareService( IConfiguration config)
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


    }
}
