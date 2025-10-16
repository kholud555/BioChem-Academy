using Application.DTOS;
using Application.Services;
using AutoMapper;
using Core.Entities;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LessonsController : ControllerBase
    {
        private readonly LessonService _lessonService;
        private readonly IMapper _mapper;

        public LessonsController(LessonService lessonService, IMapper mapper)
        {
            _lessonService = lessonService;
            _mapper = mapper;
        }

        [HttpGet("units/{unitId:int}/lessons")]
        public async Task<ActionResult<IEnumerable<LessonDTO>>> GetLessonsByUnit(int unitId)
        {
            var lessons = await _lessonService.GetLessonsByUnitAsync(unitId);
            var dto = _mapper.Map<IEnumerable<LessonDTO>>(lessons);
            return Ok(dto);
        }

        [HttpGet("lessons/{id:int}")]
        public async Task<ActionResult<LessonDTO>> GetLessonById(int id)
        {
            var lesson = await _lessonService.GetLessonByIdAsync(id);
            var dto = _mapper.Map<LessonDTO>(lesson);
            return Ok(dto);
        }

        [HttpPost("lessons")]
        public async Task<ActionResult> AddLesson([FromBody] CreateLessonDTO dto)
        {
            var newLesson = await _lessonService.CreateLessonAsync(dto);
            var finalNewLessonDto = _mapper.Map<LessonDTO>(newLesson);
            return CreatedAtAction(nameof(GetLessonById), new { id = finalNewLessonDto.Id }, finalNewLessonDto);
        }


        [HttpPut("lessons/{id:int}")]
        public async Task<ActionResult> UpdateLesson(int id, [FromBody] LessonDTO dto)
        {
            if (id != dto.Id)
                return BadRequest("ID in URL does not match ID in body");

            await _lessonService.UpdateLessonAsync(dto);
            return NoContent();
        }

        [HttpDelete("lessons/{id:int}")]
        public async Task<ActionResult> DeleteLesson(int id)
        {
            var success = await _lessonService.DeleteLessonAsync(id);
            if (!success) return NotFound("Lesson failed to delete");
            return NoContent();
        }
    }
}
