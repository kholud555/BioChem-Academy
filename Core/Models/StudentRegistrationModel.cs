using Core.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class StudentRegistrationModel
    {
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty ;
        public string Password { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string ParentPhone { get; set; } = string.Empty;

        public StudentRegistrationModel(string userName , string email , string password , string grade , string phoneNumber , string parentNumber)
        {
            
            UserName = userName ;
            Email = email ;
            Password = password ;
            Grade = grade ;
            PhoneNumber = phoneNumber ;
            ParentPhone = parentNumber ;

        }

        public  void ValidateStudentInfo ()
        {
           
            if (String.IsNullOrWhiteSpace(Email)) throw new ArgumentNullException("Email is required");
            if (String.IsNullOrWhiteSpace(Password)) throw new ArgumentNullException("Password is required");
            if (String.IsNullOrWhiteSpace(UserName)) throw new ArgumentNullException("User Name is required");

        }

    }
}
