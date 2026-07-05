using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.ProductImage;
using Store.Application.Services.Abstract;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductImagesController : ControllerBase
    {
        private readonly IProductImageService _productImageService;

        public ProductImagesController(IProductImageService productImageService)
        {
            _productImageService = productImageService;
        }

        // Tum gorselleri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var images = await _productImageService.GetAllAsync();
            return Ok(images);
        }

        // Id'ye gore gorsel getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var image = await _productImageService.GetByIdAsync(id);

            if (image == null)
                return NotFound("Gorsel bulunamadi.");

            return Ok(image);
        }

        // Yeni gorsel ekle
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Add(CreateProductImageDto dto)
        {
            await _productImageService.AddAsync(dto);

            return Ok("Gorsel basariyla eklendi.");
        }

        // Gorsel guncelle
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductImageDto dto)
        {
            dto.Id = id;

            await _productImageService.UpdateAsync(dto);

            return Ok("Gorsel basariyla guncellendi.");
        }

        // Gorsel sil
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productImageService.DeleteAsync(id);

            return Ok("Gorsel basariyla silindi.");
        }
    }
}
