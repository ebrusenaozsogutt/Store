using Store.Application.DTOs.Auth;
using Store.Application.Interfaces.Repositories;
using Store.Application.Services.Abstract;
using Store.Application.Services.Jwt;
using Store.Domain.Entities;
using Store.Domain.Enums;

namespace Store.Application.Services.Concrete
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtService _jwtService;

        public AuthService(IUserRepository userRepository, JwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task RegisterAsync(RegisterDto dto)
        {
            ValidateRegisterDto(dto);

            var normalizedEmail = dto.Email.Trim();
            var exists = await _userRepository.AnyAsync(x => x.Email == normalizedEmail);

            if (exists)
                throw new InvalidOperationException("Bu e-posta adresi zaten kayitli.");

            var user = new User
            {
                FullName = dto.FullName.Trim(),
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = UserRole.Customer,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto dto)
        {
            ValidateLoginDto(dto);

            var normalizedEmail = dto.Email.Trim();
            var user = await _userRepository.GetByEmailAsync(normalizedEmail);

            if (user == null)
                return null;

            var passwordCorrect = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

            if (!passwordCorrect)
                return null;

            var roleName = user.Role.ToString();
            var token = _jwtService.GenerateToken(user.Id, user.Email, roleName);

            return new LoginResponseDto
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = roleName
            };
        }

        private static void ValidateRegisterDto(RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FullName))
                throw new ArgumentException("Ad soyad bos olamaz.");

            ValidateCredentials(dto.Email, dto.Password);
        }

        private static void ValidateLoginDto(LoginDto dto)
        {
            ValidateCredentials(dto.Email, dto.Password);
        }

        private static void ValidateCredentials(string email, string password)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("E-posta bos olamaz.");

            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Sifre bos olamaz.");
        }
    }
}
