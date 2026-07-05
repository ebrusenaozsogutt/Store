using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Store.Domain.Enums;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Store.Application.Services.Jwt
{
    public class JwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(int userId, string email, string role)
        {
            var key = GetRequiredJwtSetting("Key");
            var issuer = GetRequiredJwtSetting("Issuer");
            var audience = GetRequiredJwtSetting("Audience");
            var expireMinutes = GetExpireMinutes();
            var normalizedRole = NormalizeRole(role);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, normalizedRole)
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GetRequiredJwtSetting(string key)
        {
            var value = _configuration[$"Jwt:{key}"];

            if (string.IsNullOrWhiteSpace(value))
                throw new InvalidOperationException($"Jwt:{key} ayari bos veya eksik.");

            return value;
        }

        private double GetExpireMinutes()
        {
            var expireMinutesValue = _configuration["Jwt:ExpireMinutes"];

            if (string.IsNullOrWhiteSpace(expireMinutesValue))
                return 60;

            if (!double.TryParse(expireMinutesValue, out var expireMinutes) || expireMinutes <= 0)
                return 60;

            return expireMinutes;
        }

        private static string NormalizeRole(string role)
        {
            if (string.IsNullOrWhiteSpace(role))
                return UserRole.Customer.ToString();

            if (int.TryParse(role, out var numericRole))
            {
                return numericRole == (int)UserRole.Admin
                    ? UserRole.Admin.ToString()
                    : UserRole.Customer.ToString();
            }

            return role.Equals(UserRole.Admin.ToString(), StringComparison.OrdinalIgnoreCase)
                ? UserRole.Admin.ToString()
                : UserRole.Customer.ToString();
        }
    }
}
