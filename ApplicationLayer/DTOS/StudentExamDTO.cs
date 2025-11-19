using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class StudentExamDTO
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public DateTime SubmittedAt { get; set; }
        public int ExamId { get; set; }
        public string ExamTitle { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; }
    }
}
