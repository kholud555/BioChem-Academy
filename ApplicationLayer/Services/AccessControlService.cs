using Application.DTOS;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace Application.Services
{
    public class AccessControlService
    {
        private readonly IAccessControlRepository _repo;
        private readonly IMapper _mapper;
        private readonly StoreContext _context;

        public AccessControlService(IAccessControlRepository repo ,IMapper mapper, StoreContext context)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
        }

        public async Task AccessGrantAsync (AccessControlDTO dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto), "object cannot be null.");

            if (dto.StudentId <= 0) throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");

            var isGranted = await _repo.GrantAccess(dto.StudentId, dto.grantedSectionId , dto.GrantedType);

            if (!isGranted) throw new ArgumentException("Type not Supported");
        }

        public async Task RevokeAccessAsync(AccessControlDTO dto)
        {
            if (dto == null) throw new ArgumentNullException(nameof(dto), "object cannot be null.");

            if (dto.StudentId <= 0) throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");

            var isGranted = await _repo.RevokeAccess(dto.StudentId, dto.grantedSectionId, dto.GrantedType);

            if (!isGranted) throw new ArgumentException("Type not Supported");
        }


        public async Task<StudentPermissionsDTO> GetStudentPermissionsAsync(int studentId , bool includeNames = false)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null)
                throw new KeyNotFoundException("Student not found");

            var accessList = 
                await _repo.GetStudentPermissionsAsync(studentId);

            var gradeIds = accessList.Where(a => a.GradeId != null).Select(a => a.GradeId.Value).ToList();
            var termIds = accessList.Where(a => a.TermId != null).Select(a => a.TermId.Value).ToList();
            var unitIds = accessList.Where(a => a.UnitId != null).Select(a => a.UnitId.Value).ToList();
            var lessonIds = accessList.Where(a => a.LessonId != null).Select(a => a.LessonId.Value).ToList();

            //expand hierarchies
            var expandedTermUnits = await _context.Units
                .Where(u => termIds.Contains(u.TermId))
                .Select(u => u.Id)
                .ToListAsync();

            var expandedTermLessons = await _context.Lessons
                .Where(l => expandedTermUnits.Contains(l.UnitId))
                .Select(l => l.Id)
                .ToListAsync();

            var expandedGradeTerms = await _context.Terms
                .Where(t => gradeIds.Contains(t.GradeId))
                .Select(t => t.Id)
                .ToListAsync();

            var expandedGradeUnits = await _context.Units
                .Where(u => expandedGradeTerms.Contains(u.TermId))
                .Select(u => u.Id)
                .ToListAsync();

            var expandedGradeLessons = await _context.Lessons
                .Where(l => expandedGradeUnits.Contains(l.UnitId))
                .Select(l => l.Id)
                .ToListAsync();

            var result = new StudentPermissionsDTO
            {
                StudentId = studentId,
                GrantedGrade = gradeIds,
                GrantedTerms = termIds.Union(expandedGradeTerms).Distinct().ToList(),
                GrantedUnits = unitIds.Union(expandedTermUnits).Union(expandedGradeUnits).Distinct().ToList(),
                GrantedLessons = lessonIds.Union(expandedTermLessons).Union(expandedGradeLessons).Distinct().ToList(),
            };

            if(includeNames)
            {
                result.GradeNames = await _context.Grades
                     .Where(g => result.GrantedGrade.Contains(g.Id))
                     .Select(g => g.GradeName)
                     .ToListAsync();

                result.TermNames = await _context.Terms
                   .Where(t => result.GrantedTerms.Contains(t.Id))
                   .Select(t => t.TermOrder)
                   .ToListAsync();

                result.UnitNames = await _context.Units
                    .Where(u => result.GrantedUnits.Contains(u.Id))
                    .Select(u => u.Title)
                    .ToListAsync();

                result.LessonNames = await _context.Lessons
                    .Where(l => result.GrantedLessons.Contains(l.Id))
                    .Select(l => l.Title)
                    .ToListAsync();
            }

            return result;
        }
    }
}
