using Store.Application.DTOs.User;

namespace Store.Application.Services.Abstract
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();

        Task<UserDto?> GetByIdAsync(int id);

        Task AddAsync(CreateUserDto dto);

        Task UpdateAsync(UpdateUserDto dto);

        Task DeleteAsync(int id);
    }
}