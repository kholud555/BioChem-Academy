using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class PresignRequestDTO
    {
            public string Subject { get; set; }
            public string Grade { get; set; }
            public string Term { get; set; }
            public string Unit { get; set; }
            public int LessonId { get; set; }
            public string FileName { get; set; }

    }
}
