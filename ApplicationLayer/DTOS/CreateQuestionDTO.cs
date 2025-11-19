using Core.Entities;
using System.ComponentModel.DataAnnotations;


namespace Application.DTOS
{
   public class CreateQuestionDTO
   {
       
        [Required(ErrorMessage = "Question header is required")]
        public string QuestionHeader { get; set; }
        [Required(ErrorMessage = "Mark  is required")]
        public decimal Mark { get; set; }

        [Required(ErrorMessage = "Exam type  is required")]
        public ExamTypeEnum Type { get; set; }
         public int ExamId { get; set; }

        //public List<QuestionChoiceDTO> Choices { get; set; } = new();

    }

}

