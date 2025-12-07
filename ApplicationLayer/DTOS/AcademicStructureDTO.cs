using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class AcademicStructureDTO
    {
        public string? GradeName { get; set; } = string.Empty;
    

        public List<TermStructureDTO>? firstTerm { get; set; } = new();

        public List<TermStructureDTO>? SecondTerm { get; set; } = new();

    }
}
