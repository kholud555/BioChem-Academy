using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOS
{
    public class MediaAdminDTO
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string MediaType { get; set; } = string.Empty; 
        public string FileFormat { get; set; } = string.Empty;
        public float? Duration { get; set; }
        public string PreviewUrl { get; set; } = string.Empty;
    }
}
