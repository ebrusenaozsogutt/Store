namespace Store.Application.DTOs.Product
{
    public class CreateProductDto
    {
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public decimal? DiscountPrice { get; set; }

        public int StockQuantity { get; set; }

        public int CategoryId { get; set; }
    }
}