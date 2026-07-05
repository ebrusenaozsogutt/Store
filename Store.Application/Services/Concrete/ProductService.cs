using Store.Application.DTOs.Product;
using Store.Application.Interfaces.Repositories;
using Store.Application.Services.Abstract;
using Store.Domain.Entities;

namespace Store.Application.Services.Concrete
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        // Tum urunleri getir
        public async Task<List<ProductDto>> GetAllAsync()
        {
            var products = await _productRepository.GetAllAsync();

            return products.Select(x => new ProductDto
            {
                Id = x.Id,
                Title = x.Title,
                Description = x.Description,
                Price = x.Price,
                DiscountPrice = x.DiscountPrice,
                StockQuantity = x.StockQuantity,
                CategoryId = x.CategoryId,
                CreatedAt = x.CreatedAt
            }).ToList();
        }

        // Id'ye gore urun getir
        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
                return null;

            return new ProductDto
            {
                Id = product.Id,
                Title = product.Title,
                Description = product.Description,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                StockQuantity = product.StockQuantity,
                CategoryId = product.CategoryId,
                CreatedAt = product.CreatedAt
            };
        }

        // Urun ekle
        public async Task AddAsync(CreateProductDto dto)
        {
            ValidateProduct(dto.Title, dto.Price, dto.DiscountPrice, dto.StockQuantity);

            var product = new Product
            {
                Title = dto.Title.Trim(),
                Description = dto.Description,
                Price = dto.Price,
                DiscountPrice = dto.DiscountPrice,
                StockQuantity = dto.StockQuantity,
                CategoryId = dto.CategoryId,
                CreatedAt = DateTime.UtcNow
            };

            await _productRepository.AddAsync(product);
            await _productRepository.SaveChangesAsync();
        }

        // Urun guncelle
        public async Task UpdateAsync(UpdateProductDto dto)
        {
            ValidateProduct(dto.Title, dto.Price, dto.DiscountPrice, dto.StockQuantity);

            var product = await _productRepository.GetByIdAsync(dto.Id);

            if (product == null)
                return;

            product.Title = dto.Title.Trim();
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.DiscountPrice = dto.DiscountPrice;
            product.StockQuantity = dto.StockQuantity;
            product.CategoryId = dto.CategoryId;

            _productRepository.Update(product);
            await _productRepository.SaveChangesAsync();
        }

        // Urun sil
        public async Task DeleteAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null)
                return;

            _productRepository.Delete(product);
            await _productRepository.SaveChangesAsync();
        }

        private static void ValidateProduct(string title, decimal price, decimal? discountPrice, int stockQuantity)
        {
            if (string.IsNullOrWhiteSpace(title))
                throw new ArgumentException("Urun basligi bos olamaz.");

            if (price <= 0)
                throw new ArgumentException("Urun fiyati 0'dan buyuk olmalidir.");

            if (discountPrice.HasValue && discountPrice.Value >= price)
                throw new ArgumentException("Indirimli fiyat normal fiyattan kucuk olmalidir.");

            if (stockQuantity < 0)
                throw new ArgumentException("Stok miktari negatif olamaz.");
        }
    }
}
