using Core.Entities;

namespace Core.Interfaces
{
    public interface IStudentExamRepository
    {
        Task<StudentExam> SubmitExamAsync(StudentExam studentExam);
        Task<IEnumerable<StudentExam>> GetStudentResultsAsync(int studentId);
        Task<IEnumerable<StudentExam>> GetExamResultsAsync(int examId);
        Task<bool> HasStudentSubmittedExamAsync(int studentId, int examId);
    }
}
