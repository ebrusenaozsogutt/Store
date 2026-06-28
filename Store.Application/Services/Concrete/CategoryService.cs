using Store.Application.DTOs.Category;
using Store.Application.Interfaces.Repositories;
using Store.Application.Services.Abstract;
using Store.Domain.Entities;

namespace Store.Application.Services.Concrete
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // Tüm kategorileri DTO olarak getir
        public async Task<List<CategoryDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();

            return categories.Select(x => new CategoryDto
            {
                Id = x.Id,
                Name = x.Name,
                ParentCategoryId = x.ParentCategoryId
            }).ToList();
        }

        // Id'ye göre kategori getir
        public async Task<CategoryDto?> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                return null;

            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                ParentCategoryId = category.ParentCategoryId
            };
        }

        // Yeni kategori ekle
        public async Task AddAsync(CreateCategoryDto dto)
        {
            var category = new Category
            {
                Name = dto.Name,
                ParentCategoryId = dto.ParentCategoryId
            };

            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();
        }

        // Güncelle
        public async Task UpdateAsync(UpdateCategoryDto dto)
        {
            var category = await _categoryRepository.GetByIdAsync(dto.Id);

            if (category == null)
                return;

            category.Name = dto.Name;
            category.ParentCategoryId = dto.ParentCategoryId;

            _categoryRepository.Update(category);
            await _categoryRepository.SaveChangesAsync();
        }

        // Sil
        public async Task DeleteAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);

            if (category == null)
                return;

            _categoryRepository.Delete(category);
            await _categoryRepository.SaveChangesAsync();
        }
    }
}