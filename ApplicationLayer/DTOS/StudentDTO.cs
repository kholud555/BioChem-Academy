using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class StudentDTO
    {
        public int Id { get; set; }
        public string UserName { get; set; }

        public string Email { get; set; }

        public string Grade { get; set; }

        public string PhoneNumber { get; set; }

        public string ParentNumber { get; set; }
        
    }
}
