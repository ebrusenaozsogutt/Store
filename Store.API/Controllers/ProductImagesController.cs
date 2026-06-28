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

        // Tüm görselleri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var images = await _productImageService.GetAllAsync();
            return Ok(images);
        }

        // Id'ye göre görsel getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var image = await _productImageService.GetByIdAsync(id);

            if (image == null)
                return NotFound("Görsel bulunamadı.");

            return Ok(image);
        }

        // Yeni görsel ekle
        [HttpPost]
        public async Task<IActionResult> Add(CreateProductImageDto dto)
        {
            await _productImageService.AddAsync(dto);

            return Ok("Görsel başarıyla eklendi.");
        }

        // Görsel güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductImageDto dto)
        {
            dto.Id = id;

            await _productImageService.UpdateAsync(dto);

            return Ok("Görsel başarıyla güncellendi.");
        }

        // Görsel sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productImageService.DeleteAsync(id);

            return Ok("Görsel başarıyla silindi.");
        }
    }
}