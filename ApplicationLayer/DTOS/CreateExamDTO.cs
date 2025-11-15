using Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class CreateExamDTO
    {
        [Required(ErrorMessage = "Title is required")]
        [StringLength(200, ErrorMessage = "Title cannot exceed 200 characters")]
        public string Title { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Level is required")]
        [EnumDataType(typeof(ExamLevelEnum), ErrorMessage = "Invalid value for Level")]
        public ExamLevelEnum Level { get; set; }

        [Required(ErrorMessage = "ReferenceId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "ReferenceId must be a positive number")]
        public int ReferenceId { get; set; }

        [Required(ErrorMessage = "TimeLimit is required")]
        [Range(1, 300, ErrorMessage = "TimeLimit must be between 1 and 300 minutes")]
        public int TimeLimit { get; set; }

        public bool IsPublished { get; set; } = false;
    }
}
