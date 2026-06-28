using Store.Application.Interfaces.Repositories;
using Store.Domain.Entities;
using Store.Infrastructure.Persistence;

namespace Store.Infrastructure.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(StoreDbContext context) : base(context)
        {
        }
    }
}

//üstteki yapıyla da beraber CategoryRepository --> genericRepository --> dbContext --> PostgreSQL şeklinde zincir oluştu
//CategoryRepository şu anda GenericRepository'deki bütün metotları otomatik kullanabiliyor.