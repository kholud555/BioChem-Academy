using System.ComponentModel.DataAnnotations;

namespace API.DTOS
{
    public class StudentRegisterDTO
    {
        
        [MinLength(3,ErrorMessage ="User Name Must be More Than 3 Letters")]
        public string UserName { get; set; } = string.Empty;
        [Required]
        [RegularExpression(@"^((\+20|0)?(10|11|12|15)\d{8}|(\+968)?[79]\d{7})$",
        ErrorMessage = "رقم غير صالح يجب أن يكون رقم مصري أو عماني")]
        public string PhoneNumber { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        [RegularExpression(@"^((\+20|0)?(10|11|12|15)\d{8}|(\+968)?[79]\d{7})$", 
        ErrorMessage = "رقم غير صالح يجب أن يكون رقم مصري أو عماني")]
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
