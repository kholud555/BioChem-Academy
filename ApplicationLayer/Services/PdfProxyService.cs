using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class PdfProxyService
    {
        private readonly HttpClient _httpClient;

        public PdfProxyService(HttpClient httpClient)
        {
          _httpClient = httpClient;
        }

        public async Task<Stream> GetPdfStreamAsync(string url)
        {

            if (string.IsNullOrWhiteSpace(url))
                throw new  ArgumentException ("URL is required.");

            var result = await _httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead);

            if (!result.IsSuccessStatusCode)
                throw new InvalidOperationException("Cannot load PDF file.");

            return await result.Content.ReadAsStreamAsync();
        }

        public string GetContentType(string url)
        {
            return "application/pdf";
        }

    }
}
