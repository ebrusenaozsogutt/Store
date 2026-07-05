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

        // Tum urunleri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        // Id'ye gore urun getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);

            if (product == null)
                return NotFound("Urun bulunamadi.");

            return Ok(product);
        }

        // Yeni urun ekle
        [HttpPost]
        public async Task<IActionResult> Add(CreateProductDto dto)
        {
            await _productService.AddAsync(dto);

            return Ok("Urun basariyla eklendi.");
        }

        // Urun guncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateProductDto dto)
        {
            dto.Id = id;

            await _productService.UpdateAsync(dto);

            return Ok("Urun basariyla guncellendi.");
        }

        // Urun sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _productService.DeleteAsync(id);

            return Ok("Urun basariyla silindi.");
        }
    }
}
