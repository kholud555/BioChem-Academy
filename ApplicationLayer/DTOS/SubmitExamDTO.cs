using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class SubmitExamDTO
    {
        [Required(ErrorMessage = "ExamId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "ExamId must be a positive number")]
        public int ExamId { get; set; }

        [Required(ErrorMessage = "Answers are required")]
        public List<StudentAnswerDTO> Answers { get; set; }
    }
}
