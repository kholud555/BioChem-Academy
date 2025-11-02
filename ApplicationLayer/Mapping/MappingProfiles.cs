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

            //Student
            CreateMap<Student, StudentDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(scr => scr.User.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(scr => scr.User.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(scr => scr.User.PhoneNumber))
                .ForMember(dest => dest.ParentNumber, opt => opt.MapFrom(scr => scr.ParentPhone))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(scr => scr.Id));

            //Media 
            //CreateMap<Media, MediaDTO>();
            CreateMap<MediaDTO, Media>();

        }
    }
}
