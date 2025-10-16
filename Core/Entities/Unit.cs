using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
   public class Unit : BaseEntity
   {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int Order { get; set; }
        public bool IsFree { get; set; }
        public bool IsPublished { get; set; }
        public int TermId { get; set; }
        public Term Term{ get; set; }
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
        public ICollection<AccessControl> AccessControls { get; set; } = new List<AccessControl>();
   }
}
