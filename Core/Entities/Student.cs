using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
   public class Student
   {
        [Key, ForeignKey("User")]
        public int Id { get; set; }
        public string Grade { get; set; }
        public string ParentPhone { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public ICollection<AccessControl> AccessControls { get; set; } = new List<AccessControl>();
        public ICollection<StudentExam> StudentExam { get; set; } = new List<StudentExam>();
    }
}
