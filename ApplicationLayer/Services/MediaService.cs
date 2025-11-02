using Application.DTOS;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class MediaService
    {
        private readonly IMediaRepository _repo;
        private readonly IMapper _mapper;

        public MediaService(IMediaRepository repo , IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<Media> AddMediaAsync (MediaDTO dto)
        {
            if(dto == null) throw new ArgumentNullException("Object should not be null");

            if (String.IsNullOrWhiteSpace(dto.StorageKey)) throw new ArgumentNullException("File path should not be null");

            if(dto.LessonId <= 0) throw new ArgumentOutOfRangeException("Id Should Be Greater than 0");

            var media = _mapper.Map<Media>(dto);

            var newMedia = await _repo.AddMediaAsync(media);

            if(newMedia == null) throw new ArgumentNullException("Media did not add");

            return newMedia;
        }


    }
}
