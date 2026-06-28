namespace Store.Application.DTOs.Order
{
    public class CreateOrderDto
    {
        public int ProductId { get; set; }

        public int UserId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string CustomerPhone { get; set; } = string.Empty;

        public string CustomerAddress { get; set; } = string.Empty;
    }
}