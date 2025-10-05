using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.DTOS;
        
namespace Core.Interfaces
{
    public interface IStudentService
    {
        Task <Student> Registration(StudentRegisterDTO  );
    }
}
