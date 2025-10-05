using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
  public class StudentRepository:IStudentRepository
    {
        
        private readonly StoreContext _Context;

        public StudentRepository( StoreContext context) {
            
            this._Context = context;


        }

        public async Task<Student> Registration(Student student)
        {
            if(student == null) throw new ArgumentNullException(nameof(student));
            if(student.User == null) throw new ArgumentNullException(nameof(student.User));
            if(string.IsNullOrEmpty(student.User.Email)) throw new ArgumentNullException("User Email Must be provided before save");
            _Context.Students.Add(student);
            await _Context.SaveChangesAsync();
            return student;
        }
    }
}
