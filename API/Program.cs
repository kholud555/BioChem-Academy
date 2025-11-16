
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

            // Repository
            builder.Services.AddScoped<IExamRepository, ExamRepository>();

            // Service
            builder.Services.AddScoped<ExamService>();

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
                        .WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    }

                }
                );

            });

            var app = builder.Build();

            // Seed default roles before processing requests
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                await SeedRolesAndAdminAsync(services);

            }
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            
            app.UseExceptionHandler();

           //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("GeneralCORSConfig");

            app.UseAuthentication();  
            
            app.UseAuthorization(); 
            
            app.MapControllers();      

            app.Run();
       }

        //Seeding Roles And Admin
        private static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            string[] roleNames = { "Admin", "Student" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole<int>(roleName));
                }
            }

            var adminEmail = "BioChem_Academy111@gmail.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = "admin",
                    Email = adminEmail,
                    EmailConfirmed = true,
                    Role = RoleEnum.Admin,
                    CreatedAt = DateTime.Now,
                };

                var result = await userManager.CreateAsync(adminUser, "CL_na_$_#5");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }


    }

}

