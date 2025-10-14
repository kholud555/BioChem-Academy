using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.IO;

namespace API.Filters
{
    public class ValidateModelAttribute :ActionFilterAttribute
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {
            if(!context.ModelState.IsValid )
            {
                var httpContext = context.HttpContext;

                var errors = context.ModelState
                        .Where(e => e.Value.Errors.Count > 0)
                        .Select(e => new
                        {
                            Field = e.Key,
                            Errors = e.Value.Errors.Select(x => x.ErrorMessage).ToArray()

                        });

                var path = httpContext.Request.Path;
                var traceId = httpContext.TraceIdentifier;

                var errorResponse = new
                {
                    State = 400,
                    ErrorCode = "VALIDATION_ERROR",
                    Message = "One or more validation errors occurred.",
                    Timestamp = DateTime.UtcNow,
                    Path = path,
                    TraceId = traceId,
                    Details = errors
                };

                context.Result = new BadRequestObjectResult(errorResponse);
            }
        }
    }
}
