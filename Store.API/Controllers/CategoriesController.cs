using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.Category;
using Store.Application.Services.Abstract;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // Tüm kategorileri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

        // Id'ye göre kategori getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);

            if (category == null)
                return NotFound("Kategori bulunamadı.");

            return Ok(category);
        }

        // Yeni kategori ekle
        [HttpPost]
        public async Task<IActionResult> Add(CreateCategoryDto dto)
        {
            await _categoryService.AddAsync(dto);

            return Ok("Kategori başarıyla eklendi.");
        }

        // Kategori güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateCategoryDto dto)
        {
            dto.Id = id;

            await _categoryService.UpdateAsync(dto);

            return Ok("Kategori başarıyla güncellendi.");
        }

        // Kategori sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _categoryService.DeleteAsync(id);

            return Ok("Kategori başarıyla silindi.");
        }
    }
}