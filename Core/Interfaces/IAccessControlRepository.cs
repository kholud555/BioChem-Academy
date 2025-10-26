using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IAccessControlRepository
    {
       
        Task<bool> GrantAccess(int studentId, int grantedSectionId , GrantedSectionsEnum grantedSections);

        Task<bool> RevokeAccess(int studentId, int grantedSectionId , GrantedSectionsEnum grantedSections);

        Task<List<AccessControl>> GetStudentPermissionsAsync(int studentId);

        
    }
}
