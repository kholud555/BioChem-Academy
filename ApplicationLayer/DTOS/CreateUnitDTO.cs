using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    using System.ComponentModel.DataAnnotations;

    public class CreateUnitDTO
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 100 characters")]
        public string Title { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Order is required")]
        [Range(1, 100, ErrorMessage = "Order must be between 1 and 100")]
        public int Order { get; set; }

        public bool IsFree { get; set; } = false;

        public bool IsPublished { get; set; } = false;

        [Required(ErrorMessage = "TermId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "TermId must be a positive number")]
        public int TermId { get; set; }
    }

}
