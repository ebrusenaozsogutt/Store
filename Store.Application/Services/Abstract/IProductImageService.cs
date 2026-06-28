using Store.Application.DTOs.ProductImage;

namespace Store.Application.Services.Abstract
{
    public interface IProductImageService
    {
        Task<List<ProductImageDto>> GetAllAsync();

        Task<ProductImageDto?> GetByIdAsync(int id);

        Task AddAsync(CreateProductImageDto dto);

        Task UpdateAsync(UpdateProductImageDto dto);

        Task DeleteAsync(int id);
    }
}