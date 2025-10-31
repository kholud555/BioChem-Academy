using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
   public class Media :BaseEntity
    {
        public string MediaType { get; set; }
        public string StorageKey { get; set; }
        public float? Duration { get; set; }
        public string MimeType { get; set; }
        public int LessonId { get; set; }
        public Lesson Lesson { get; set; }


    }
}
