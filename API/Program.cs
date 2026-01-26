
using API.Filters;
using Application.Services;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Security.Claims;

namespace API
{
    public class Program
    {
        
       public static async Task Main(string[] args)
        {

            var builder = WebApplication.CreateBuilder(args);

            //Add Filers To Controllers
           builder.Services.AddControllers(option => option.Filters.Add<ValidateModelAttribute>());

            //Register AutoMapper
            builder.Services.AddAutoMapper(typeof(MappingProfiles));

            // Register Student service and repository
            builder.Services.AddScoped<IStudentRepository, StudentRepository>();
            builder.Services.AddScoped<StudentServices>();

            // Register Grade service and repository 
            builder.Services.AddScoped<IGradeRepository , GradeRepository>();
            builder.Services.AddScoped<GradeService>();

            // Register Term service and repository 
            builder.Services.AddScoped<ITermRepository, TermRepository>();
            builder.Services.AddScoped<TermService>();

            // Register Unit service and repository 
            builder.Services.AddScoped<IUnitRepository, UnitRepository>();
            builder.Services.AddScoped<UnitService>();

            // Register Lesson service and repository 
            builder.Services.AddScoped<ILessonRepository, LessonRepository>();
            builder.Services.AddScoped<LessonService>();

            // Register Access Control service and repository
            builder.Services.AddScoped<IAccessControlRepository, AccessControlRepository>();
            builder.Services.AddScoped<AccessControlService>();

            // Register Media service and repository
            builder.Services.AddScoped<IMediaRepository, MediaRepository>();
            builder.Services.AddScoped<MediaService>();

            builder.Services.AddScoped<IQuestionRepository, QuestionRepository>();
            builder.Services.AddScoped<QuestionService>();

            // Repository
            builder.Services.AddScoped<IExamRepository, ExamRepository>();
            builder.Services.AddScoped<ExamService>();

            // Repository
            builder.Services.AddScoped<IStudentExamRepository, StudentExamRepository>();
            builder.Services.AddScoped<StudentExamService>();

            // Repository
            builder.Services.AddScoped<ISubjectRepository, SubjectRepository>();
            builder.Services.AddScoped<SubjectService>();

            //=========================================
            // Register R2 Cloud Flare Service
            builder.Services.AddScoped<R2CloudFlareService>();

            // Register Jwt Token Service  
            builder.Services.AddScoped<JwtTokenService>();

            // Register Global Exception Handler 
            builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
            builder.Services.AddProblemDetails();

            //Add Swagger configuration 
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                // Define the Bearer authentication scheme to be used in Swagger UI
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter JWT token in the format: Bearer {your token}"
                });

                // Apply the security scheme globally to all endpoints in Swagger
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                   {
                      new OpenApiSecurityScheme
                      {
                         Reference = new OpenApiReference
                         {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer" // Must match the scheme defined above
                         }
                      },
                      Array.Empty<string>() // No specific scopes required
                   }
                });
            });

            // Register EF DbContext  & Admin seedings
            builder.Services.AddDbContext<StoreContext>( opt =>
            {
                opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); 
            });

            // JWT Configurations
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);


            // Register Identity & Add Role Service to Identity 
            builder.Services.AddIdentity<User, IdentityRole<int>>(options =>
            {
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                options.User.AllowedUserNameCharacters = null;

            })
                .AddEntityFrameworkStores<StoreContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                //options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    RoleClaimType = ClaimTypes.Role,
                    NameClaimType = ClaimTypes.Name,

                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

            });

            // Register CORS Configuration
            builder.Services.AddCors( option =>
            {
                option.AddPolicy("GeneralCORSConfig", policy => 
                {
                    var eniv = builder.Environment;

                    if(eniv.IsDevelopment())
                    {
                        policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .SetIsOriginAllowed(_=> true);
                    }
                    else
                    {
                        policy
                        .WithOrigins("https://biochemacademy.net", "http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    }

                }
                );

            });

            //builder.Logging.ClearProviders();
            //builder.Logging.AddDebug();


            var app = builder.Build();


            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}

            //test
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "BioChem API V1");
                c.RoutePrefix = "swagger"; // يعني هتفتح على: http://yoursite.com/swagger
            });

            app.UseExceptionHandler();

           app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("GeneralCORSConfig");

            app.UseAuthentication();  
            
            app.UseAuthorization(); 
            
            app.MapControllers();      

            app.Run();
       }
    }

}

