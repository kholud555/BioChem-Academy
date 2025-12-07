using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class TermStructureDTO
    {
        public string TermName { get; set; }

        public List<UnitStructureDTO> units { get; set; } = new();

    }
}
