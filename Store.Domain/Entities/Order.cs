namespace Store.Domain.Entities
{
    public class Order
    {
        public int Id { get; set; }

        public int ProductId { get; set; }

        public int? UserId { get; set; }

        public int Quantity { get; set; }

        public decimal UnitPrice { get; set; }

        public decimal TotalPrice { get; set; }

        public string CustomerName { get; set; } = string.Empty;

        public string CustomerPhone { get; set; } = string.Empty;

        public string CustomerAddress { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public Product? Product { get; set; }

        public User? User { get; set; }
    }
}
