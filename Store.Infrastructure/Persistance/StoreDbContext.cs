using Microsoft.EntityFrameworkCore;
using Store.Domain.Entities;

namespace Store.Infrastructure.Persistence
{
    public class StoreDbContext : DbContext
    {
        //StoreDbContext oluşturulurken çalışacak metot
        //parantez içi ise ayar paketi
        //base options constructor ile gelen ayarları, üst sınıf olan DbContexte gönderir
        public StoreDbContext(DbContextOptions<StoreDbContext> options) : base(options)
        {
        }
        //category entitysini veritabanındaki categories tablosuna dönüştürür
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<Order> Orders { get; set; }
}
}
