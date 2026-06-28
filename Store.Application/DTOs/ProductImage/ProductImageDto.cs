namespace Store.Application.DTOs.ProductImage
{
    public class ProductImageDto
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public bool IsCover { get; set; }
    }
}