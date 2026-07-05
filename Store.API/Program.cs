using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Store.Application.Interfaces.Repositories;
using Store.Application.Services.Abstract;
using Store.Application.Services.Concrete;
using Store.Application.Services.Jwt;
using Store.Infrastructure.Persistence;
using Store.Infrastructure.Repositories;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
const string CorsPolicyName = "ViteClient";

// Controllers
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicyName, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = GetJwtSettingOrDefault(jwtSettings, "Key", "Store2026SuperSecretKey123456789");
var jwtIssuer = GetJwtSettingOrDefault(jwtSettings, "Issuer", "StoreAPI");
var jwtAudience = GetJwtSettingOrDefault(jwtSettings, "Audience", "StoreClient");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            RoleClaimType = ClaimTypes.Role
        };
    });

builder.Services.AddAuthorization();

// Repository
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductImageRepository, ProductImageRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();

// Services
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductImageService, ProductImageService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<JwtService>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<StoreDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseCors(CorsPolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

static string GetJwtSettingOrDefault(IConfigurationSection jwtSettings, string key, string defaultValue)
{
    var value = jwtSettings[key];
    return string.IsNullOrWhiteSpace(value) ? defaultValue : value;
}
