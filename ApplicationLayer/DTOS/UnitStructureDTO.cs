using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class UnitStructureDTO
    {
        public string UnitName { get; set; }

        public List<LessonDTO> Lessons { get; set; } = new();
    }
}
