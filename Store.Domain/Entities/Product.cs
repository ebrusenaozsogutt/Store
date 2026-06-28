namespace Store.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        //string.Empty bu alanın başlangıç değeri var diyor
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        //indirmli fiyat olmayabilir. o yüzden ? koyduk
        public decimal? DiscountPrice { get; set; }

        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public DateTime CreatedAt { get; set; }

        //category null olabilir
        public Category? Category { get; set; }
        //birkaç tane fotoğraf eklenebilir bağlantısını kurduk 

        public ICollection<ProductImage> ProductImages { get; set; }
    = new List<ProductImage>();
        public ICollection<Order> Orders { get; set; }
    = new List<Order>();
    }
}   