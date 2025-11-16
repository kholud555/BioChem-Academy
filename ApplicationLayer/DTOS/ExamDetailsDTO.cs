using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class ExamDetailsDTO : ExamDTO
    {
        public int QuestionsCount { get; set; }
        public int StudentsAttempted { get; set; }
    }
}
