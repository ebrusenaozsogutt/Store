using Store.Application.DTOs.Category;

namespace Store.Application.Services.Abstract
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync();

        Task<CategoryDto?> GetByIdAsync(int id);

        Task AddAsync(CreateCategoryDto dto);

        Task UpdateAsync(UpdateCategoryDto dto);

        Task DeleteAsync(int id);
    }
}