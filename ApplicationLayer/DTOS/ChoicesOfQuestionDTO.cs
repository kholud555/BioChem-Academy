using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class ChoicesOfQuestionDTO
    {
        public int? Id { get; set; }
        [Required(ErrorMessage = "Choice فext is required")]
        public string ChoiceText { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        [Required(ErrorMessage = "Question id  is required")]
        public int QuestionId { get; set; }
    }
}
