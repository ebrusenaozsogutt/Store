namespace Store.Application.DTOs.ProductImage
{
    public class CreateProductImageDto
    {
        public int ProductId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public bool IsCover { get; set; }
    }
}