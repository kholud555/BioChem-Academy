using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Grade : BaseEntity
    {
        public required string GradeName { get; set; }

        public ICollection<Term> Terms { get; set; } = new List<Term>();
        public ICollection<AccessControl> AccessControls { get; set; } = new List<AccessControl>();
    }
}
