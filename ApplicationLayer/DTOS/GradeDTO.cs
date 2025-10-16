using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Application.DTOS
{
    public class GradeDTO
    {
        [Required(ErrorMessage = "ID is required")]
        public int ID { get; set; }

        [Required(ErrorMessage = "Grade name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Grade name must be between 2 and 100 characters")]
        public string GradeName { get; set; } = string.Empty;
    }

}
