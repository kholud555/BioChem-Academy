using Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class TermDTO
    {
        public int Id { get; set; }
        [EnumDataType(typeof(TermEnum))]
        public TermEnum TermOrder { get; set; }
        public bool IsFree { get; set; } = false;
        public bool IsPublished { get; set; } = false ;
        public int GradeId { get; set; }
    }
}
