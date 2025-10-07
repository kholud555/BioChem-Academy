using System.Net;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _environment;

        public ExceptionMiddleware(RequestDelegate next , ILogger<ExceptionMiddleware> logger , IHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;  
        }

        public async Task InvokeAsync (HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex,$"Exception:{ex.Message}");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                var traceId = context.TraceIdentifier;
                var path = context.Request.Path;

                var response = new
                {
                    Status = context.Response.StatusCode,
                    ErrorCode = "INTERNAL_SERVER_ERROR",
                    Message = _environment.IsDevelopment() ? ex.Message : "An unexpected error occurred.",
                    Timestamp = DateTime.UtcNow,
                    Path = path,
                    TraceId = traceId,
                    Details = _environment.IsDevelopment() ? ex.StackTrace : null
                };

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

                await context.Response.WriteAsJsonAsync(response, options);
            }
        }
    }
}
