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
        public async Task<ActionResult<QuestionDTO>> GetQuestionById(int id)
        {
            var question = await _service.GetQuestionByIdAsync(id);
            var dto = _mapper.Map<QuestionDTO>(question);
            return Ok(dto);
        }

        [HttpPost("AddQuestionHeader")]
        public async Task<ActionResult<QuestionDTO>> AddQuestionHeader([FromBody] CreateQuestionDTO dto)
        {
            var newQuestion = await _service.AddQuestionHeaderAsync(dto);

            var newQuestionDto = _mapper.Map<QuestionDTO>(newQuestion);

            return Ok(newQuestionDto);
        }

        [HttpPost("AddQuestionChoice")]
        public async Task<ActionResult<QuestionChoicesDTO>> AddQuestionChoice ([FromBody] CreateQuestionChoicesDTO dto)
        {
            var newQuestionChoice = await _service.AddQuestionChoicesAsync(dto);

            var newQuestionChoiceDto = _mapper.Map<QuestionChoicesDTO>(newQuestionChoice);

            return Ok(newQuestionChoiceDto);
        }

        [HttpPut("UpdateQuestionHeader")]
        public async Task<IActionResult> UpdateQuestionHeader ([FromBody] QuestionDTO dto)
        {
            var question = await _service.UpdateQuestionHeaderAsync(dto);
            return NoContent();
        }

        [HttpPut("UpdateQuestionChoice")]
        public async Task<IActionResult> UpdateQuestionChoice([FromBody] QuestionChoicesDTO dto)
        {
            var question = await _service.UpdateQuestionChoiceAsync(dto);
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
