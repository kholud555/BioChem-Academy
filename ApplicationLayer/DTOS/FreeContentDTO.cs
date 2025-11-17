using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class FreeContentDTO
    {
        public string GradeName { get; set; }
        public string Term { get; set; }
        public string UnitName { get; set; }
        public string LessonName { get; set; }
        public List<StudentAccessedMediaDTo> MediaOfFreeLesson { get; set; } = new();
    }
}
