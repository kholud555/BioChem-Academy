
using API.Filters;
using API.Middleware;
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

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();

            //Add Filers To Controllers
            builder.Services.AddControllers(option => option.Filters.Add<ValidateModelAttribute>());
          
            //Register AutoMapper
            builder.Services.AddAutoMapper(typeof(MappingProfiles));

            // Register Student service and repository
            builder.Services.AddScoped<IStudentRepository, StudentRepository>();
            builder.Services.AddScoped<IStudentService , StudentServices>();

            // Register Jwt Token Service  
            builder.Services.AddScoped<JwtTokenService>();


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

            // Register EF DbContext 
            builder.Services.AddDbContext<StoreContext>( opt =>
            {
                opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
            });

            // JWT Configurations
            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]!);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

            });

            // Register Identity
            builder.Services.AddIdentity<User , IdentityRole<int>>(options =>
            {
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                
            })
                .AddEntityFrameworkStores<StoreContext>()
                .AddDefaultTokenProviders();

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

            //Register Custom ExceptionMiddleware
            app.UseMiddleware<API.Middleware.ExceptionMiddleware>();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("GeneralCORSConfig");

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();

            // Seeds default roles into the system if they don't exist.
            async Task SeedRolesAsync (WebApplication App)
            {
                var Scope = app.Services.CreateScope();

                var roleManager = Scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

                string[] roles = new[] { "Admin", "Student" };

                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                    {
                        await roleManager.CreateAsync(new IdentityRole<int>(role));
                    }
                }
            }

            await SeedRolesAsync(app);

            app.Run();
        }
    }
}
