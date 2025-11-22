
using System.ComponentModel.DataAnnotations.Schema;


namespace Core.Entities
{
    public class AccessControl : BaseEntity
    {
        public bool IsGranted { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int StudentId { get; set; }
        public Student student { get; set; }

        public int? SubjectId { get; set; }
        public Subject? Subject { get; set; }
        public int? GradeId { get; set; } 
        public Grade? Grade { get; set; }

        public int? TermId { get; set; }
        public Term? Term { get; set; }

        public int? UnitId { get; set; }
        public Unit? Unit { get; set; }

        public int? LessonId { get; set; }
        public Lesson? Lesson { get; set; }

    }
}
