using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PdfProxyController : ControllerBase
    {
        private readonly PdfProxyService _service;

        public PdfProxyController(PdfProxyService service)
        {
            this._service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetPdf([FromQuery] string url)
        { 
            var stream = await _service.GetPdfStreamAsync(url);

            var contentType = _service.GetContentType(url);

         
            Response.Headers["Content-Disposition"] = "inline";
            Response.Headers["X-Download-Options"] = "noopen";
            Response.Headers["X-Content-Type-Options"] = "nosniff";
            Response.Headers["Cache-Control"] = "no-store, no-cache";

            // مهم ل PDF.js
            Response.Headers["Accept-Ranges"] = "bytes";

            return File(stream, contentType);
        }
    }
}
