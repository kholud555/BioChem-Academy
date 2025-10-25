using Application.DTOS;
using AutoMapper;
using Core.Interfaces;
using Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class AccessControlService
    {
        private readonly IAccessControlRepository _repo;
        private readonly IMapper _mapper;

        public AccessControlService(IAccessControlRepository repo ,IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
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
    }
}
