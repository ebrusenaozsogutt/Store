using Store.Application.DTOs.Product;

namespace Store.Application.Services.Abstract
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllAsync();

        Task<ProductDto?> GetByIdAsync(int id);

        Task AddAsync(CreateProductDto dto);

        Task UpdateAsync(UpdateProductDto dto);

        Task DeleteAsync(int id);
    }
}