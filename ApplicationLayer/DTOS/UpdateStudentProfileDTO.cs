using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class UpdateStudentProfileDTO
    {
        [MinLength(3, ErrorMessage = "User Name Must be More Than 3 Letters")]
        public string UserName { get; set; } = string.Empty;

        [RegularExpression(@"^01[0-9]{9}$", ErrorMessage = "Must start with 01 and be 11 digits.")]
        public string PhoneNumber { get; set; } = string.Empty;

        public string Grade { get; set; } = string.Empty;

        [RegularExpression(@"^01[0-9]{9}$", ErrorMessage = "Must start with 01 and be 11 digits.")]
        public string ParentNumber { get; set; } = string.Empty;

    }
}
