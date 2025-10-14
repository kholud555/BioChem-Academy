using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Exam : BaseEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }

        [EnumDataType(typeof(ExamLevelEnum))]
        public ExamLevelEnum Level { get; set; }
        public int ReferenceId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public int TimeLimit { get; set; }
        public bool IsPublished { get; set; }

        public ICollection<Question> Questions { get; set; } = new List<Question>();
        public ICollection<StudentExam> StudentExam { get; set; } = new List<StudentExam>();
    }
}
