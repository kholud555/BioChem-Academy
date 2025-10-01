using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
   public class Student : BaseEntity
   {
        public float Grade { get; set; }
        public string ParentPhone { get; set; }
    }
}
