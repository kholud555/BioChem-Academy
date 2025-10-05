using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
   public class Student : BaseEntity
   {
        public float Grade { get; set; }
        public string ParentPhone { get; set; }
        public int UserId { get; set; }

        public User User { get; set; }
        public ICollection<AccessControl> AccessControls { get; set; } = new List<AccessControl>();
        public ICollection<StudentExam> StudentExam { get; set; } = new List<StudentExam>();
    }
}
