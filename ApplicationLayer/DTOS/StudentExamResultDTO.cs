using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class StudentExamResultDTO
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public double Percentage { get; set; }
        public DateTime SubmittedAt { get; set; }
        public int ExamId { get; set; }
        public string ExamTitle { get; set; }
        public string ExamDescription { get; set; }
        public int TimeLimit { get; set; }
    }
}
