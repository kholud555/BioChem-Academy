namespace API.DTOS
{
    public class StudentRegisterDTO
    {
        
        public string UserName { get; set; }

        public string PhoneNumber { get; set; }

        public float Grade { get; set; }
        public string ParentPhone { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
