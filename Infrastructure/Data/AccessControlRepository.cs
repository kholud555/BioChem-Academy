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
                        // check id term exist in DB
                        var Term = await _context.Terms.FirstOrDefaultAsync(t => t.Id == grantedSectionId);
                        if (Term == null) 
                            throw new KeyNotFoundException($"Term with id {grantedSectionId} not found.");


                        //check if term has already access
                        var isTermGranted = allStudentAccesses.Any(a => a.TermId == grantedSectionId);
                        if (isTermGranted) 
                            return true;
                            

                        //check if grade already accessed
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

        public Task<bool> RevokeAccess(int studentId, int grantedSectionId, GrantedSectionsEnum grantedSections)
        {
            throw new NotImplementedException();
        }
    }
}
