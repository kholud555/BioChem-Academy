using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
   public interface IStudentRepository
    {
       Task <Student> Registration(Student student);
        Task<Student> GetStudentByIdAsync(int id);

        Task<IEnumerable<Student>> GetAllStudentAsync();

        Task<bool> UpdateStudentAsync(Student student);
            
        Task<int> GetStudentIdByUserID(int userId);

    }
}
