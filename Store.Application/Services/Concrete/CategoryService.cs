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

        // Tum kategorileri DTO olarak getir
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

        // Id'ye gore kategori getir
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
            ValidateCategoryName(dto.Name);

            var category = new Category
            {
                Name = dto.Name.Trim(),
                ParentCategoryId = dto.ParentCategoryId
            };

            await _categoryRepository.AddAsync(category);
            await _categoryRepository.SaveChangesAsync();
        }

        // Guncelle
        public async Task UpdateAsync(UpdateCategoryDto dto)
        {
            ValidateCategoryName(dto.Name);

            var category = await _categoryRepository.GetByIdAsync(dto.Id);

            if (category == null)
                return;

            category.Name = dto.Name.Trim();
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

        private static void ValidateCategoryName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Kategori adi bos olamaz.");
        }
    }
}
