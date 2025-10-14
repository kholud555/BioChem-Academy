using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class Admin : BaseEntity
    {
        public int UserId { get; set; }
        public User user { get; set; }
    }
}
