using Application.DTOS;
using Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly QuestionService _service;
        private readonly IMapper _mapper;

        public QuestionController(QuestionService service , IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet("GetQuestionById")]
        public async Task<IActionResult> GetQuestion(int id)
        {
            var question = await _service.GetQuestionByIdAsync(id);
            return Ok(question);
        }

        //[HttpPost("AddQuestion")]
        //public async Task<ActionResult> AddQuestion([FromBody] CreateQuestionDTO dto)
        //{
        //    var newQuestion = await _service.SaveQuestionAsync(dto);

        //    var newQuestionDto = _mapper.Map<CreateQuestionDTO>(newQuestion);

        //    return CreatedAtAction(nameof(GetQuestion), new { id = dto.Id }, newQuestionDto);
        //}

        [HttpPut("UpdateQuestion")]
        public async Task<IActionResult> UpdateQuestion([FromBody] CreateQuestionDTO dto)
        {
            var question = await _service.SaveQuestionAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            await _service.DeleteQuestionAsync(id);
            return NoContent();
        }
    }
}
