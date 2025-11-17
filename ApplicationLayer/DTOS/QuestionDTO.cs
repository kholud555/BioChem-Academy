using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class QuestionDTO : CreateQuestionDTO
    {
       
        public int? Id { get; set; }
    }
}
