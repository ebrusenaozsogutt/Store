using Microsoft.AspNetCore.Authorization;
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

        // Tum kullanicilari getir
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        // Id'ye gore kullanici getir
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound("Kullanici bulunamadi.");

            return Ok(user);
        }

        // Yeni kullanici ekle
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add(CreateUserDto dto)
        {
            await _userService.AddAsync(dto);

            return Ok("Kullanici basariyla eklendi.");
        }

        // Kullanici guncelle
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateUserDto dto)
        {
            dto.Id = id;

            await _userService.UpdateAsync(dto);

            return Ok("Kullanici basariyla guncellendi.");
        }

        // Kullanici rolunu guncelle
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/role")]
        public async Task<IActionResult> UpdateRole(int id, UpdateUserRoleDto dto)
        {
            try
            {
                await _userService.UpdateRoleAsync(id, dto);
                return Ok("Kullanici rolu guncellendi.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // Kullanici sil
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userService.DeleteAsync(id);

            return Ok("Kullanici basariyla silindi.");
        }
    }
}
