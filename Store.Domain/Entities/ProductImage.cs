namespace Store.Domain.Entities
{
    public class ProductImage
    {
        public int Id { get; set; }
        //bu resim hangi ürüne ait (foreign key)
        public int ProductId { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsCover { get; set; }
        public Product? Product { get; set; }
    }
}
