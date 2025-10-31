using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
   public class StudentPermissionsDTO
   {
        public int StudentId { get; set; }

        public List<int> GrantedGrade { get; set; } = new();
        public List<int> GrantedTerms { get; set; } = new();
        public List<int> GrantedUnits { get; set; } = new();
        public List<int> GrantedLessons { get; set; } = new();

        public List<string> GradeNames { get; set; } = new();
       
        public List<TermEnum> TermNames { get; set; } = new();
        public List<string> UnitNames { get; set; } = new();
        public List<string> LessonNames { get; set; } = new();



    }
}
