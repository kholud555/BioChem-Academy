using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
   public class Media :BaseEntity
    {
        [EnumDataType(typeof(MediaTypeEnum))]
        public MediaTypeEnum MediaType { get; set; }
        public string StorageKey { get; set; }
        public float? Duration { get; set; }
        [EnumDataType(typeof(FileFormatEnum))]
        public FileFormatEnum FileFormat { get; set; }
        public int LessonId { get; set; }
        public Lesson Lesson { get; set; }

   }
}
