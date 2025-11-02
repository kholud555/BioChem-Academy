using Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class MediaDTO
    {
        [Required(ErrorMessage = "Media type  is required")]
        [EnumDataType(typeof(MediaTypeEnum), ErrorMessage = "Invalid value for Media type")]
        public MediaTypeEnum MediaType { get; set; }

        [Required(ErrorMessage = "File path  is required")]
        public string StorageKey { get; set; } = string.Empty;

        public double? Duration { get; set; }

        [Required(ErrorMessage = "File format is required")]
        [EnumDataType(typeof(FileFormatEnum), ErrorMessage = "Invalid value for File Format")]
        public FileFormatEnum FileFormat { get; set; }

        [Required(ErrorMessage = "Lesson Id is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Lesson Id must be a positive number")]
        public int LessonId { get; set; }
    }
}
