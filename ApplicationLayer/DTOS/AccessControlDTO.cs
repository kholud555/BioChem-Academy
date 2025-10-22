using Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class AccessControlDTO
    {
        [Required(ErrorMessage = "Granted Type is required")]
        [EnumDataType(typeof(GrantedSectionsEnum), ErrorMessage = "Invalid value for GrantedType")]
        public GrantedSectionsEnum GrantedType { get; set; }

        [Required(ErrorMessage = "Student Id is required")]
        public int StudentId { get; set; }

        [Required(ErrorMessage = "Granted  Id is required")]
        public int grantedSectionId { get; set; }
    }
}
