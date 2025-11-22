using Application.DTOS;
using AutoMapper;
using Core.Entities;


namespace Infrastructure.Data
{
    public class MappingProfiles :Profile
    {
        public MappingProfiles() {

            //Grade
            CreateMap<Grade, GradeDTO>();

            //Term
            CreateMap<Term, TermDTO>();
            CreateMap<CreateTermDTO , Term>();
            CreateMap<TermDTO, Term>();

            //Unit
            CreateMap<CreateUnitDTO, Unit>();
            CreateMap<UnitDTO, Unit>();
            CreateMap<Unit ,UnitDTO>();

            //Lesson
            CreateMap<Lesson, LessonDTO>();
            CreateMap<CreateLessonDTO, Lesson>();
            CreateMap<LessonDTO, Lesson>();

            //Student
            CreateMap<Student, StudentDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(scr => scr.User.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(scr => scr.User.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(scr => scr.User.PhoneNumber))
                .ForMember(dest => dest.ParentNumber, opt => opt.MapFrom(scr => scr.ParentPhone))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(scr => scr.Id));

            //Media 
            CreateMap<MediaDTO, Media>();

            CreateMap<CreateQuestionDTO, Question>().ReverseMap();

            CreateMap<HeaderQuestionDTO, Question>();
            CreateMap<Question, HeaderQuestionDTO>();

            CreateMap<ChoicesOfQuestionDTO, QuestionChoice>();
            CreateMap<QuestionChoice, ChoicesOfQuestionDTO>()
                .ForMember(dest => dest.Id,
                    opt => opt.MapFrom(src => src.Id));

            CreateMap<QuestionDTO, Question>()
                .ForMember(dest => dest.Id,
                    opt => opt.MapFrom(src => src.Id));

            CreateMap<Question ,QuestionDTO>();

            // CreateExamDTO -> Exam
            CreateMap<CreateExamDTO, Exam>();

            // ExamDTO -> Exam
            CreateMap<ExamDTO, Exam>();

            // Exam -> ExamDTO
            CreateMap<Exam, ExamDTO>();

            // Exam -> ExamDetailsDTO
            CreateMap<Exam, ExamDetailsDTO>()
                .ForMember(dest => dest.QuestionsCount,
                    opt => opt.MapFrom(src => src.Questions.Count))
                .ForMember(dest => dest.StudentsAttempted,
                    opt => opt.MapFrom(src => src.StudentExam.Count));


            // SubmitExamDTO -> StudentExam
            CreateMap<SubmitExamDTO, StudentExam>()
                .ForMember(dest => dest.SubmittedAt, opt => opt.MapFrom(src => DateTime.Now));

            // StudentExam -> StudentExamDTO
            CreateMap<StudentExam, StudentExamDTO>()
                .ForMember(dest => dest.ExamTitle, opt => opt.MapFrom(src => src.Exam.Title))
                .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => src.Student.User.UserName));

            // StudentExam -> StudentExamResultDTO
            CreateMap<StudentExam, StudentExamResultDTO>()
                .ForMember(dest => dest.TotalQuestions,
                    opt => opt.MapFrom(src => src.Exam.Questions.Count))
                .ForMember(dest => dest.Percentage,
                    opt => opt.MapFrom(src => src.Score))
                .ForMember(dest => dest.ExamTitle,
                    opt => opt.MapFrom(src => src.Exam.Title))
                .ForMember(dest => dest.ExamDescription,
                    opt => opt.MapFrom(src => src.Exam.Description))
                .ForMember(dest => dest.TimeLimit,
                    opt => opt.MapFrom(src => src.Exam.TimeLimit));

            //Subject
            CreateMap<Subject, SubjectDTO>();
            CreateMap<SubjectDTO ,Subject>();
        }
    }
}
