using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class ExamResultsDTO
    {
        public int ExamId { get; set; }
        public string ExamTitle { get; set; }
        public int TotalStudents { get; set; }
        public double AverageScore { get; set; }
        public int HighestScore { get; set; }
        public int LowestScore { get; set; }
        public List<StudentExamDTO> StudentResults { get; set; }
    }
}
