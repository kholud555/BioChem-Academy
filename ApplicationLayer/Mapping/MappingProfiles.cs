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

            CreateMap<Grade, GradeDTO>();

            CreateMap<Term, TermDTO>();


        }
    }
}
