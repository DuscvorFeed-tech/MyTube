using System;
using System.Text;
using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using MyTube.API.Helpers;
using MyTube.API.Helpers.Extensions;
using MyTube.API.Helpers.Middleware.Jwt;
using MyTube.Data;
using MyTube.Services.Helpers.Logging;
using MyTube.Services.Helpers.Settings;
using MyTube.API.Helpers.Logging;

namespace MyTube.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.Configure<FormOptions>(x =>
            {
                // x.ValueLengthLimit = int.MaxValue;

                //  Set the limit to 32 GB
                x.MultipartBodyLengthLimit = 32212254720;
            });

            services.AddCors(options =>
            {
                options.AddPolicy("AllowOrigin",
                    builder => builder.AllowAnyOrigin());
            });

            services.AddDbContext<DataContext>(opt =>
                opt.UseMySQL(Configuration.GetConnectionString("DBConnectionString"))
            );

            services.AddControllers()
            /**
             *  Used to properly map params to model
             *  Ex.
             *  
             *      Model {
             *  
             *          public int prop1 { get; set; }
             *      
             *      }
             *      
             *      Request params: 
             *      
             *      Example #1
             *      {
             *          "prop1": "1",
             *      }
             *      
             *      Example #2
             *      {
             *          "prop1": 1,
             *      }
             */
            .AddNewtonsoftJson();

            services
            .AddMvc(
                opt =>
                {
                    opt.Filters.Add(typeof(ModelStateFilter));
                }
            )
            .ConfigureApiBehaviorOptions(
                options =>
                {
                    options.SuppressConsumesConstraintForFormFileParameters = true;
                    options.SuppressInferBindingSourcesForParameters = true;
                    options.SuppressModelStateInvalidFilter = true;
                    options.SuppressMapClientErrors = true;
                }
            )
            .AddFluentValidation(
                fvc =>
                {
                    fvc.RegisterValidatorsFromAssemblyContaining<Startup>();
                    fvc.RunDefaultMvcValidationAfterFluentValidationExecutes = false;
                }
            );

            services.AddSingleton<IWeRaveYouLog, WeRaveYouLogging>();

            services.AddWeRaveYouServices();

            services.AddAutoMapper(typeof(Startup));

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            services.AddApiSettings(Configuration);

            #region JWT configuration

            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            var appSettings = appSettingsSection.Get<AppSettings>();

            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    RequireExpirationTime = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });

            #endregion

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IWeRaveYouLog logger)
        {
            if (env.IsDevelopment())
            {
                app.UseStatusCodePagesWithReExecute("/error/{0}");
            }
            else
            {
                app.UseExceptionHandler("/error");
                app.UseHsts();
            }

            app.ConfigureExceptionHandler(logger);

            app.UseRouting();

            app.UseCors(x => x
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader());

            app.UseAuthorization();

            app.UseMiddleware<JwtMiddleware>();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

    }

}
