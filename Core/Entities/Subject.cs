using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Subject : BaseEntity
    {
        public required string SubjectName { get; set; }

        public ICollection<Grade> Grades { get; set; } = new List<Grade>();

        public ICollection<AccessControl> AccessControls { get; set; } = new List<AccessControl>();
    }
}
