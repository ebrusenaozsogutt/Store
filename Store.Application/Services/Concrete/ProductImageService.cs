using Store.Application.DTOs.ProductImage;
using Store.Application.Interfaces.Repositories;
using Store.Application.Services.Abstract;
using Store.Domain.Entities;

namespace Store.Application.Services.Concrete
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _productImageRepository;

        public ProductImageService(IProductImageRepository productImageRepository)
        {
            _productImageRepository = productImageRepository;
        }

        // Tüm ürün görsellerini getir
        public async Task<List<ProductImageDto>> GetAllAsync()
        {
            var images = await _productImageRepository.GetAllAsync();

            return images.Select(x => new ProductImageDto
            {
                Id = x.Id,
                ProductId = x.ProductId,
                ImageUrl = x.ImageUrl,
                IsCover = x.IsCover
            }).ToList();
        }

        // Id'ye göre görsel getir
        public async Task<ProductImageDto?> GetByIdAsync(int id)
        {
            var image = await _productImageRepository.GetByIdAsync(id);

            if (image == null)
                return null;

            return new ProductImageDto
            {
                Id = image.Id,
                ProductId = image.ProductId,
                ImageUrl = image.ImageUrl,
                IsCover = image.IsCover
            };
        }

        // Görsel ekle
        public async Task AddAsync(CreateProductImageDto dto)
        {
            var image = new ProductImage
            {
                ProductId = dto.ProductId,
                ImageUrl = dto.ImageUrl,
                IsCover = dto.IsCover
            };

            await _productImageRepository.AddAsync(image);
            await _productImageRepository.SaveChangesAsync();
        }

        // Görsel güncelle
        public async Task UpdateAsync(UpdateProductImageDto dto)
        {
            var image = await _productImageRepository.GetByIdAsync(dto.Id);

            if (image == null)
                return;

            image.ProductId = dto.ProductId;
            image.ImageUrl = dto.ImageUrl;
            image.IsCover = dto.IsCover;

            _productImageRepository.Update(image);
            await _productImageRepository.SaveChangesAsync();
        }

        // Görsel sil
        public async Task DeleteAsync(int id)
        {
            var image = await _productImageRepository.GetByIdAsync(id);

            if (image == null)
                return;

            _productImageRepository.Delete(image);
            await _productImageRepository.SaveChangesAsync();
        }
    }
}