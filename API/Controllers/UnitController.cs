using Application.DTOS;
using Application.Services;
using AutoMapper;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitController : ControllerBase
    {
        private readonly UnitService _unitService;
        private readonly IMapper _mapper;

        public UnitController (UnitService unitService, IMapper mapper)
        {
            _unitService = unitService;
            _mapper = mapper;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<UnitDTO>> GetUnitById(int id)
        {
            var unit = await _unitService.GetUnitByIdAsync(id);
            var dto = _mapper.Map<UnitDTO>(unit);
            return Ok(dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("AddUnit")]
        public async Task<ActionResult> AddUnit([FromBody] CreateUnitDTO dto)
        {
            var newUnit = await _unitService.createUnitAsync(dto);
            var finalNewUnitDto = _mapper.Map<UnitDTO>(newUnit);
            return CreatedAtAction(nameof(GetUnitById), new { id = finalNewUnitDto.Id }, finalNewUnitDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("UpdateUnit")]
        public async Task<ActionResult> UpdateUnit ([FromBody] UnitDTO dto)
        {
            var Unit = await _unitService.UpdateUnitAsync(dto);
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteUnit (int id)
        {
            var success = await _unitService.DeleteUnitAsync(id);
            if (!success) return NotFound("Unit failed to delete");
            return NoContent();
        }

    }
}
