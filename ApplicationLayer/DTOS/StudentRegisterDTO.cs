using System.ComponentModel.DataAnnotations;

namespace API.DTOS
{
    public class StudentRegisterDTO
    {
        
        [MinLength(3,ErrorMessage ="User Name Must be More Than 3 Letters")]
        public string UserName { get; set; } = string.Empty;
        [Required]
        [RegularExpression(@"^01[0-9]{9}$", ErrorMessage = "Must start with 01 and be 11 digits.")]
        public string PhoneNumber { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        [Required]
        [RegularExpression(@"^01[0-9]{9}$", ErrorMessage = "Must start with 01 and be 11 digits.")]
        public string ParentPhone { get; set; }
        
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string ConfirmPassword { get; set; }
    }
}
