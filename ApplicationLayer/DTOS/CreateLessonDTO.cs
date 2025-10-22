using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
   public class CreateLessonDTO
    {
       [Required(ErrorMessage = "Title is required")]
        [StringLength(150, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 150 characters")]
        public required string Title { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Order is required")]
        [Range(1, 100, ErrorMessage = "Order must be between 1 and 100")]
        public int Order { get; set; }

        public bool IsFree { get; set; } = false;

        public bool IsPublished { get; set; } = false;

        [Required(ErrorMessage = "UnitId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "UnitId must be a positive number")]
        public int UnitId { get; set; }
    

}
}
