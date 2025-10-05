using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Term : BaseEntity
    {
        [EnumDataType(typeof(TermEnum))]
        public TermEnum TermOrder { get; set; }
        public bool  IsFree { get; set; }
        public bool IsPublished { get; set; }
        public int GradeId { get; set; }
        public Grade Grade { get; set; }
        public ICollection<Unit> Units { get; set; } = new List<Unit>();
        public ICollection<AccessControl> AccessControls { get; set; } = new List<AccessControl>();
    }
}
