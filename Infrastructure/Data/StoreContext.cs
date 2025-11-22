using Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;


namespace Infrastructure.Data
{
    public class StoreContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public StoreContext(DbContextOptions<StoreContext> options)
          : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Student>()
             .HasOne(s => s.User)
             .WithOne(u => u.Student)
             .HasForeignKey<Student>(s => s.UserId);




        }

        public DbSet<Subject> Subjects { get; set; }
        public  DbSet<Student> Students { get; set; }
        public DbSet<Admin>  Admins { get; set; }
        public DbSet<Grade> Grades  { get; set; }
        public DbSet<Term> Terms  { get; set; }
        public DbSet<Unit> Units  { get; set; }
        public DbSet<Lesson> Lessons  { get; set; }
        public DbSet<Media> Medias { get; set; }
        public DbSet<AccessControl>   AccessControls{ get; set; }
        public DbSet<Exam> Exams  { get; set; }
        public DbSet<Question> Questions  { get; set; }
        public DbSet<QuestionChoice> QuestionChoices  { get; set; }
        public DbSet<StudentExam> StudentExams  { get; set; }

}

   
}
