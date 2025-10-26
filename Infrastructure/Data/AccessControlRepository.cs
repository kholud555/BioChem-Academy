using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Collections.Specialized.BitVector32;

namespace Infrastructure.Data
{
    public class AccessControlRepository : IAccessControlRepository
    {
        private readonly StoreContext _context;

        public AccessControlRepository(StoreContext context)
        {
            _context = context;
        }

        private async Task AddAccessRecordAsync(int studentId, int? gradeId = null, int? termId = null, int? unitId = null, int? lessonId = null)
        {
            var access = new AccessControl
            {
                StudentId = studentId,
                GradeId = gradeId,
                TermId = termId,
                UnitId = unitId,
                LessonId = lessonId,
                IsGranted = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.AccessControls.Add(access);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> GrantAccess(int studentId, int grantedSectionId, GrantedSectionsEnum grantedSections)
        {

            var isStudentExist = await _context.Students.AnyAsync(s => s.Id == studentId);
            if (!isStudentExist) throw new KeyNotFoundException($"Student with id {studentId} not found.");


            var allStudentAccesses = await _context.AccessControls.Where(a => a.StudentId == studentId).ToListAsync();
           

            switch (grantedSections)
            {
                case GrantedSectionsEnum.Grades:
                    {
                        var isGradeExist = await _context.Grades.AnyAsync(g => g.Id == grantedSectionId);
                        if (!isGradeExist) 
                            throw new KeyNotFoundException($"Grade with id {grantedSectionId} not found.");

                        var isGradeGranted = allStudentAccesses.Any(a => a.GradeId == grantedSectionId);
                        if (isGradeGranted) 
                            return true;
                     
                        await AddAccessRecordAsync(studentId,gradeId: grantedSectionId);
                    }
                    break;


                case GrantedSectionsEnum.Terms:
                    {
                        
                        var Term = await _context.Terms.FirstOrDefaultAsync(t => t.Id == grantedSectionId);
                        if (Term == null) 
                            throw new KeyNotFoundException($"Term with id {grantedSectionId} not found.");


                        
                        var isTermGranted = allStudentAccesses.Any(a => a.TermId == grantedSectionId);
                        if (isTermGranted) 
                            return true;
                            

                        
                        var isGradeGranted = allStudentAccesses.Any(a => a.GradeId == Term.GradeId);
                        if (isGradeGranted) 
                            return true;
                       
                        await AddAccessRecordAsync(studentId,gradeId:Term.GradeId,termId: grantedSectionId);
                    }
                    break;

                case GrantedSectionsEnum.Units:
                    {
                        var unit = await _context.Units.FirstOrDefaultAsync(u => u.Id == grantedSectionId);
                        if (unit == null)
                            throw new KeyNotFoundException($"Unit {grantedSectionId} not found");

                        var termOfUnit = await _context.Terms.FirstOrDefaultAsync(t => t.Id == unit.TermId);

                        if(allStudentAccesses.Any(a => a.UnitId == unit.Id || a.TermId == unit.TermId || a.GradeId == termOfUnit.GradeId))
                            return true;

                        await AddAccessRecordAsync(studentId,termOfUnit.GradeId ,unit.TermId , unit.Id);
                    }
                    break;

                case GrantedSectionsEnum.Lessons:
                    {
                        var lesson = await _context.Lessons.FirstOrDefaultAsync(l => l.Id == grantedSectionId);
                        if (lesson == null)
                            throw new KeyNotFoundException($"Lesson {grantedSectionId} not found");

                        var unitForLesson = await _context.Units.FirstAsync(u => u.Id == lesson.UnitId);
                        var termForLesson = await _context.Terms.FirstAsync(t => t.Id == unitForLesson.TermId);

                        if (allStudentAccesses.Any(a =>
                            a.LessonId == lesson.Id ||
                            a.UnitId == unitForLesson.Id ||
                            a.TermId == termForLesson.Id ||
                            a.GradeId == termForLesson.GradeId))
                            return true;

                        await AddAccessRecordAsync(studentId, termForLesson.GradeId, termForLesson.Id, unitForLesson.Id, lesson.Id);

                    }
                    break;

                    default:
                    return false;
            }

        
            return true;
        }

        public async Task<bool> RevokeAccess(int studentId, int grantedSectionId, GrantedSectionsEnum grantedSections)
        {
            var isStudentExist = await _context.Students.AnyAsync(s => s.Id == studentId);
            if (!isStudentExist) throw new KeyNotFoundException($"Student with id {studentId} not found.");

            var allStudentAccesses = await _context.AccessControls.Where(a => a.StudentId == studentId).ToListAsync();

            switch (grantedSections)
            {
                case GrantedSectionsEnum.Grades:
                    {
                        var grade = await _context.Grades
                            .Include(g => g.Terms)
                            .ThenInclude(t => t.Units)
                            .ThenInclude(u => u.Lessons)
                            .FirstOrDefaultAsync(g => g.Id == grantedSectionId);
                        if (grade == null)
                            throw new KeyNotFoundException($"Grade {grantedSectionId} not found.");

                        var termsOfGrade = grade.Terms.Select(t => t.Id).ToList();
                        var unitsOfGrade = grade.Terms.SelectMany(t => t.Units.Select(u => u.Id)).ToList();
                        var lessonsOfGrade = grade.Terms.SelectMany(t => t.Units.SelectMany(u => u.Lessons.Select(l => l.Id))).ToList();

                        var gradeAccess = allStudentAccesses
                             .Where(a =>
                             a.GradeId == grade.Id ||
                             (a.TermId != null && termsOfGrade.Contains(a.TermId.Value)) ||
                             (a.UnitId != null && unitsOfGrade.Contains(a.UnitId.Value)) ||
                             (a.LessonId != null && lessonsOfGrade.Contains(a.LessonId.Value))
                             ).ToList();

                        if(gradeAccess.Any())
                        {
                            _context.RemoveRange(gradeAccess);
                        }

                    }
                    break;
                case GrantedSectionsEnum.Terms:
                    {
                        var term = await _context.Terms
                            .Include(t => t.Units)
                                .ThenInclude(u => u.Lessons)
                            .FirstOrDefaultAsync(t => t.Id == grantedSectionId);

                        if (term == null)
                            throw new KeyNotFoundException($"Term {grantedSectionId} not found.");

                        var isGradeGranted = allStudentAccesses.Any(a => a.GradeId == term.GradeId);
                        if (isGradeGranted)
                            throw new ArgumentException("Cannot revoke a term while its grade is still open.");


                        var unitIds = term.Units.Select(u => u.Id).ToList();
                        var lessonIds = term.Units.SelectMany(u => u.Lessons.Select(l => l.Id)).ToList();

                        var termAccess = allStudentAccesses
                            .Where(a =>
                                a.TermId == term.Id ||
                                (a.UnitId != null && unitIds.Contains(a.UnitId.Value)) ||
                                (a.LessonId != null && lessonIds.Contains(a.LessonId.Value))
                            ).ToList();

                        if (termAccess.Any())
                            _context.AccessControls.RemoveRange(termAccess);
                    }
                    break;
                case GrantedSectionsEnum.Units:
                    {
                        var unit = await _context.Units
                            .Include(u => u.Lessons)
                            .FirstOrDefaultAsync(u => u.Id == grantedSectionId);

                        if (unit == null)
                            throw new KeyNotFoundException($"Unit {grantedSectionId} not found.");

                        var termId = unit.TermId;
                        var term = await _context.Terms.FirstAsync(t => t.Id == termId);
                        var isTermGranted = allStudentAccesses.Any(a => a.TermId == termId);
                        var isGradeGranted = allStudentAccesses.Any(a => a.GradeId == term.GradeId);

                        if (isTermGranted || isGradeGranted)
                            throw new ArgumentException("Cannot revoke a unit while its parent term or grade is still open.");

                        var lessonIds = unit.Lessons.Select(l => l.Id).ToList();

                        var unitAccess = allStudentAccesses
                            .Where(a =>
                                a.UnitId == unit.Id ||
                                (a.LessonId != null && lessonIds.Contains(a.LessonId.Value))
                            ).ToList();

                        if (unitAccess.Any())
                            _context.AccessControls.RemoveRange(unitAccess);
                    }
                    break;

                case GrantedSectionsEnum.Lessons:
                    {
                        var lesson = await _context.Lessons.FirstOrDefaultAsync(l => l.Id == grantedSectionId);
                        if (lesson == null)
                            throw new KeyNotFoundException($"Lesson {grantedSectionId} not found.");

                        var unit = await _context.Units.FirstAsync(u => u.Id == lesson.UnitId);
                        var term = await _context.Terms.FirstAsync(t => t.Id == unit.TermId);
                        var isUnitGranted = allStudentAccesses.Any(a => a.UnitId == unit.Id);
                        var isTermGranted = allStudentAccesses.Any(a => a.TermId == term.Id);
                        var isGradeGranted = allStudentAccesses.Any(a => a.GradeId == term.GradeId);

                        if (isUnitGranted || isTermGranted || isGradeGranted)
                            throw new ArgumentException("Cannot revoke a lesson while its parent unit, term, or grade is still open.");

                        var lessonAccess = allStudentAccesses
                            .Where(a => a.LessonId == lesson.Id)
                            .ToList();

                        if (lessonAccess.Any())
                            _context.AccessControls.RemoveRange(lessonAccess);
                    }
                    break;

                default:
                    return false;
            }

            return true;

        }

        public async Task<List<AccessControl>> GetStudentPermissionsAsync (int studentId)
         => await _context.AccessControls
            .Where(a => a.StudentId == studentId && a.IsGranted)
            .ToListAsync();

    }
}
