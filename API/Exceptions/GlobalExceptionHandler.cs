using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace API.Exceptions
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public Exception Error => throw new NotImplementedException();

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            // write exception message in Logs 
            _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

            // convert exception to proper message
            var (statusCode, title, detail) = MapExceptionToResponse(exception);

            // create problem details  is a standard class include exception JSON (RFC 7807)
            var problemDetails = new ProblemDetails
            {

                Status = statusCode,
                Title = title,
                Detail = detail,
                Instance = httpContext.Request.Path

            };

            // determine response if status code is 400 or 500 and send JSON to API Consumer
            httpContext.Response.StatusCode = statusCode;
            await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

            return true;
        }

        public static (int statusCode, string title, string detail) MapExceptionToResponse(Exception exception)
        {
            return exception switch
            {


                // 400 Bad Request 
                ArgumentException or
                ArgumentNullException or
                ArgumentOutOfRangeException =>
                (StatusCodes.Status400BadRequest, "Bad Request", exception.Message),

                // 401 Unauthorized
                UnauthorizedAccessException =>
                (StatusCodes.Status401Unauthorized, "Unauthorized", exception.Message),

                // 403 Forbidden 
                InvalidOperationException when exception.Message.Contains("forbidden") =>
                (StatusCodes.Status403Forbidden, "Forbidden", exception.Message),

                // 404 Not Found 
                KeyNotFoundException or
                FileNotFoundException =>
                (StatusCodes.Status404NotFound, "Not Found", exception.Message),

                // 409 Conflict 
                InvalidOperationException when exception.Message.Contains("conflict", StringComparison.OrdinalIgnoreCase) =>
                (StatusCodes.Status409Conflict, "Conflict", exception.Message),

                // 422 Unprocessable Entity
                InvalidDataException =>
                    (StatusCodes.Status422UnprocessableEntity, "Unprocessable Entity", exception.Message),

                // 408 Request Timeout
                TimeoutException =>
                    (StatusCodes.Status408RequestTimeout, "Request Timeout", "The request took too long to process"),

                // 500 Internal Server Error (default)
                _ =>
                    (StatusCodes.Status500InternalServerError, "Internal Server Error", "An unexpected error occurred. Please try again later.")
            };
        }
    }
}
