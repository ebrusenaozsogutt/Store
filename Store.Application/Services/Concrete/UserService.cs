using Store.Application.DTOs.User;
using Store.Application.Interfaces.Repositories;
using Store.Application.Services.Abstract;
using Store.Domain.Entities;
using Store.Domain.Enums;

namespace Store.Application.Services.Concrete
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Tüm kullanıcıları getir
        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Select(x => new UserDto
            {
                Id = x.Id,
                FullName = x.FullName,
                Email = x.Email,
                Role = x.Role.ToString(),
                CreatedAt = x.CreatedAt
            }).ToList();
        }

        // Id'ye göre kullanıcı getir
        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
                return null;

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString(),
                CreatedAt = user.CreatedAt
            };
        }

        // Kullanıcı ekle
        public async Task AddAsync(CreateUserDto dto)
        {
            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = dto.PasswordHash,
                Role = ParseRole(dto.Role),
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        // Kullanıcı güncelle
        public async Task UpdateAsync(UpdateUserDto dto)
        {
            var user = await _userRepository.GetByIdAsync(dto.Id);

            if (user == null)
                return;

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.PasswordHash = dto.PasswordHash;
            user.Role = ParseRole(dto.Role);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }

        // Kullanıcı rolü güncelle
        public async Task UpdateRoleAsync(int id, UpdateUserRoleDto dto)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
                throw new KeyNotFoundException("Kullanici bulunamadi.");

            user.Role = ParseRole(dto.Role);

            _userRepository.Update(user);
            await _userRepository.SaveChangesAsync();
        }

        // Kullanıcı sil
        public async Task DeleteAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            if (user == null)
                return;

            _userRepository.Delete(user);
            await _userRepository.SaveChangesAsync();
        }

        private static UserRole ParseRole(string role)
        {
            if (string.IsNullOrWhiteSpace(role))
                throw new ArgumentException("Rol bos olamaz.");

            if (role.Equals(UserRole.Admin.ToString(), StringComparison.OrdinalIgnoreCase))
                return UserRole.Admin;

            if (role.Equals(UserRole.Customer.ToString(), StringComparison.OrdinalIgnoreCase))
                return UserRole.Customer;

            throw new ArgumentException("Rol sadece Admin veya Customer olabilir.");
        }
    }
}
