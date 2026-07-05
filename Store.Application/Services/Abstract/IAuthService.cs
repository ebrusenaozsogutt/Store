using Store.Application.DTOs.Auth;

namespace Store.Application.Services.Abstract
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterDto dto);

        Task<LoginResponseDto?> LoginAsync(LoginDto dto);
    }
}