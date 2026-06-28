using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.User;
using Store.Application.Services.Abstract;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        // Tüm kullanıcıları getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        // Id'ye göre kullanıcı getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            return Ok(user);
        }

        // Yeni kullanıcı ekle
        [HttpPost]
        public async Task<IActionResult> Add(CreateUserDto dto)
        {
            await _userService.AddAsync(dto);

            return Ok("Kullanıcı başarıyla eklendi.");
        }

        // Kullanıcı güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateUserDto dto)
        {
            dto.Id = id;

            await _userService.UpdateAsync(dto);

            return Ok("Kullanıcı başarıyla güncellendi.");
        }

        // Kullanıcı sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.DeleteAsync(id);

            return Ok("Kullanıcı başarıyla silindi.");
        }
    }
}