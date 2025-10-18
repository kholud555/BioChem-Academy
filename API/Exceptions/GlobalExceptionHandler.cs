using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Security.Authentication;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

        var (statusCode, title, detail) = MapExceptionToResponse(exception);

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = httpContext.Request.Path
        };

        httpContext.Response.StatusCode = statusCode;
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }

    public static (int statusCode, string title, string detail) MapExceptionToResponse(Exception exception)
    {

        return exception switch
        {
            ArgumentException or ArgumentNullException or ArgumentOutOfRangeException =>
                (StatusCodes.Status400BadRequest, "Bad Request", exception.Message),

            UnauthorizedAccessException =>
                (StatusCodes.Status401Unauthorized, "Unauthorized", exception.Message),

            InvalidOperationException when exception.Message.Contains("forbidden", StringComparison.OrdinalIgnoreCase) =>
                (StatusCodes.Status403Forbidden, "Forbidden", exception.Message),

            KeyNotFoundException or FileNotFoundException =>
                (StatusCodes.Status404NotFound, "Not Found", exception.Message),

            InvalidOperationException when exception.Message.Contains("conflict", StringComparison.OrdinalIgnoreCase) =>
                (StatusCodes.Status409Conflict, "Conflict", exception.Message),

            InvalidDataException =>
                (StatusCodes.Status422UnprocessableEntity, "Unprocessable Entity", exception.Message),

            TimeoutException =>
                (StatusCodes.Status408RequestTimeout, "Request Timeout", "The request took too long to process"),

            _ =>
                (StatusCodes.Status500InternalServerError, "Internal Server Error", "An unexpected error occurred. Please try again later.")
        };
    }
}
