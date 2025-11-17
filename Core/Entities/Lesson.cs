using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Lesson : BaseEntity
    {
        public required string Title { get; set; }
        public string? Description { get; set; }
        public int Order { get; set; }
        public int UnitId { get; set; }
        public Unit Unit { get; set; }

        public bool IsFree { get; set; } = false;

        public ICollection<AccessControl> AccessControls { get; set; } = new List<AccessControl>();
        public ICollection<Media> Medias { get; set; } = new List<Media>();
    }
}
