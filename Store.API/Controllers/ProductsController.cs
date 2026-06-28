using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.Product;
using Store.Application.Services.Abstract;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        // Tüm ürünleri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        // Id'ye göre ürün getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);

            if (product == null)
                return NotFound("Ürün bulunamadı.");

            return Ok(product);
        }

        // Yeni ürün ekle
        [HttpPost]
        public async Task<IActionResult> Add(CreateProductDto dto)
        {
            await _productService.AddAsync(dto);

            return Ok("Ürün başarıyla eklendi.");
        }

        // Ürün güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductDto dto)
        {
            dto.Id = id;

            await _productService.UpdateAsync(dto);

            return Ok("Ürün başarıyla güncellendi.");
        }

        // Ürün sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteAsync(id);

            return Ok("Ürün başarıyla silindi.");
        }
    }
}