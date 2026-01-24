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

        [RegularExpression(@"^((0(10|11|12|15)\d{8}|\+20(10|11|12|15)\d{8})|(\+968[79]\d{7}|[79]\d{7}))$",
        ErrorMessage = "رقم غير صالح")]

        public string PhoneNumber { get; set; } = string.Empty;

        public string Grade { get; set; } = string.Empty;

        [RegularExpression(@"^((0(10|11|12|15)\d{8}|\+20(10|11|12|15)\d{8})|(\+968[79]\d{7}|[79]\d{7}))$",
        ErrorMessage = "رقم غير صالح")]

        public string ParentNumber { get; set; } = string.Empty;

    }
}
