using API.DTOS;
using Application.DTOS;
using AutoMapper;
using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        }
    }
}
