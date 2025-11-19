using Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class QuestionsOfExamDTO
    {
        public int Id { get; set; }
        public string QuestionHeader { get; set; }
        public decimal Mark { get; set; }

        public ExamTypeEnum Type { get; set; }

       public  List<ChoicesOfQuestionDTO> ChoicesOfQuestion { get; set; } = new();
    }
}
