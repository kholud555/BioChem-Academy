using Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class HeaderQuestionDTO
    {
        public int? Id { get; set; }
        [Required(ErrorMessage = "Question header is required")]
        public string QuestionHeader { get; set; }
        [Required(ErrorMessage = "Mark  is required")]
        public decimal Mark { get; set; }

        [Required(ErrorMessage = "Exam type  is required")]
        public ExamTypeEnum Type { get; set; }
        public int ExamId { get; set; }
    }
}
