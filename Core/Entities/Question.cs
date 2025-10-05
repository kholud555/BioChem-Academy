using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Question : BaseEntity
    {
        public string QuestionHeader { get; set; }
        [EnumDataType(typeof(ExamTypeEnum))]
        public ExamTypeEnum Type { get; set; }

        public int Mark { get; set; }
        public int ExamId { get; set; }
        public Exam Exam { get; set; }

        public ICollection<QuestionChoice> QuestionChoices { get; set; } = new List<QuestionChoice>();
    }
}
