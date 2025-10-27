using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
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
       

        public async Task<Student> GetStudentByIdAsync(int id)
        {
            var student = await _Context.Students.Include(s => s.User).FirstOrDefaultAsync(s => s.UserId == id);
            if (student == null) throw new KeyNotFoundException("student with not found");
            return student;
        }

        public async Task<IEnumerable<Student>> GetAllStudentAsync()
        {
            var students = await _Context.Students.Include(s => s.User).ToListAsync();
            if (students.Count == 0) throw new KeyNotFoundException("No Students");
            return students;
        }

        public async Task<bool> UpdateStudentAsync (Student student)
        {
            _Context.Students.Update(student);

            return await _Context.SaveChangesAsync() > 0;
        }

    }

}
