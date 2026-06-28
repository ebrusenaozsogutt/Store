using Microsoft.EntityFrameworkCore;
using Store.Application.Interfaces.Repositories;
using Store.Infrastructure.Persistence;
using System.Linq.Expressions;

namespace Store.Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly StoreDbContext _context;
        private readonly DbSet<T> _dbSet;

        public GenericRepository(StoreDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }
        //tablodaki tüm kayıtları getir
        public async Task<List<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }
        //ıdye göre kayıt getir
        public async Task<T?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }
        //yeni kayıt ekle
        public async Task AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
        }
        //güncelleme işlemi
        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }
        //silme işlemi
        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.AnyAsync(predicate);
        }
        //değişiklikleri kaydet(veritabanına)
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}