using Application.DTOS;
using Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentExamsController : ControllerBase
    {
        private readonly StudentExamService _studentExamService;
        private readonly IMapper _mapper;

        public StudentExamsController(StudentExamService studentExamService, IMapper mapper)
        {
            _studentExamService = studentExamService;
            _mapper = mapper;
        }

    
        [Authorize(Roles = "Student")]
        [HttpPost]
        public async Task<ActionResult<StudentExamDTO>> SubmitExam([FromBody] SubmitExamDTO dto)
        {
           
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !int.TryParse(studentIdClaim, out int studentId))
            {
                return Unauthorized("Invalid student identity");
            }

            var studentExam = await _studentExamService.SubmitExamAsync(dto, studentId);
            var result = _mapper.Map<StudentExamDTO>(studentExam);
            return Ok(result);
        }

        // GET /api/studentexams/myresults — [Student] View own results
        [Authorize(Roles = "Student")]
        [HttpGet("myresults")]
        public async Task<ActionResult<IEnumerable<StudentExamResultDTO>>> GetMyResults()
        {
            
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !int.TryParse(studentIdClaim, out int studentId))
            {
                return Unauthorized("Invalid student identity");
            }

            var results = await _studentExamService.GetStudentResultsAsync(studentId);
            var dto = _mapper.Map<IEnumerable<StudentExamResultDTO>>(results);
            return Ok(dto);
        }

        // GET /api/studentexams/{studentId} — [Admin] Student results
        //[Authorize(Roles = "Admin")]
        [HttpGet("{studentId:int}")]
        public async Task<ActionResult<IEnumerable<StudentExamResultDTO>>> GetStudentResults(int studentId)
        {
            var results = await _studentExamService.GetStudentResultsAsync(studentId);
            var dto = _mapper.Map<IEnumerable<StudentExamResultDTO>>(results);
            return Ok(dto);
        }

        // GET /api/studentexams/exam/{examId} — [Admin] Exam results
        //[Authorize(Roles = "Admin")]
        [HttpGet("exam/{examId:int}")]
        public async Task<ActionResult<ExamResultsDTO>> GetExamResults(int examId)
        {
            var results = await _studentExamService.GetExamResultsAsync(examId);
            var resultsList = results.ToList();

            if (resultsList.Count == 0)
            {
                return NotFound("No results found for this exam");
            }

            var examResultsDto = new ExamResultsDTO
            {
                ExamId = examId,
                ExamTitle = resultsList.First().Exam.Title,
                TotalStudents = resultsList.Count,
                AverageScore = resultsList.Average(r => r.Score),
                HighestScore = resultsList.Max(r => r.Score),
                LowestScore = resultsList.Min(r => r.Score),
                StudentResults = _mapper.Map<List<StudentExamDTO>>(resultsList)
            };

            return Ok(examResultsDto);
        }
    }
}

