using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Entities
{
    public class User : IdentityUser
    {
        /*inherited from IdentityUser<string>*/
        // Remove UserId - use base.Id
        // Remove UserName, Email, Password 

        public string FirstName { get; set; }
        public string LastName { get; set; }

        [EnumDataType(typeof(RoleEnum))]
        public RoleEnum Role { get; set; }
        public DateTime CreatedAt { get; set; }

        public Student Student { get; set; }

    }
}
