using Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{

    public class CreateTermDTO
    {
        [Required(ErrorMessage = "TermOrder is required")]
        [EnumDataType(typeof(TermEnum), ErrorMessage = "Invalid value for TermOrder")]
        public TermEnum TermOrder { get; set; }

        public bool IsFree { get; set; } = false;

        public bool IsPublished { get; set; } = false;

        [Required(ErrorMessage = "GradeId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "GradeId must be a positive number")]
        public int GradeId { get; set; }
    }

}
