using Store.Application.DTOs.Order;
using Store.Application.Interfaces.Repositories;
using Store.Application.Services.Abstract;
using Store.Domain.Entities;

namespace Store.Application.Services.Concrete
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public OrderService(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        // Tum siparisleri getir
        public async Task<List<OrderDto>> GetAllAsync()
        {
            var orders = await _orderRepository.GetAllAsync();

            return orders.Select(x => new OrderDto
            {
                Id = x.Id,
                ProductId = x.ProductId,
                UserId = x.UserId,
                Quantity = x.Quantity,
                UnitPrice = x.UnitPrice,
                TotalPrice = x.TotalPrice,
                CustomerName = x.CustomerName,
                CustomerPhone = x.CustomerPhone,
                CustomerAddress = x.CustomerAddress,
                CreatedAt = x.CreatedAt
            }).ToList();
        }

        // Id'ye gore siparis getir
        public async Task<OrderDto?> GetByIdAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);

            if (order == null)
                return null;

            return new OrderDto
            {
                Id = order.Id,
                ProductId = order.ProductId,
                UserId = order.UserId,
                Quantity = order.Quantity,
                UnitPrice = order.UnitPrice,
                TotalPrice = order.TotalPrice,
                CustomerName = order.CustomerName,
                CustomerPhone = order.CustomerPhone,
                CustomerAddress = order.CustomerAddress,
                CreatedAt = order.CreatedAt
            };
        }

        public async Task<decimal> GetTotalRevenueAsync()
        {
            var orders = await _orderRepository.GetAllAsync();
            return orders.Sum(x => x.TotalPrice);
        }

        // Siparis ekle
        public async Task AddAsync(CreateOrderDto dto)
        {
            ValidateQuantity(dto.Quantity);

            var product = await _productRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
                throw new InvalidOperationException("Urun bulunamadi.");

            EnsureEnoughStock(product, dto.Quantity);

            var unitPrice = GetUnitPrice(product);
            var totalPrice = unitPrice * dto.Quantity;

            product.StockQuantity -= dto.Quantity;

            var order = new Order
            {
                ProductId = dto.ProductId,
                UserId = null,
                Quantity = dto.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = totalPrice,
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                CustomerAddress = dto.CustomerAddress,
                CreatedAt = DateTime.UtcNow
            };

            await _orderRepository.AddAsync(order);
            await _orderRepository.SaveChangesAsync();
        }

        // Siparis guncelle
        public async Task UpdateAsync(UpdateOrderDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(dto.Id);

            if (order == null)
                throw new InvalidOperationException("Siparis bulunamadi.");

            ValidateQuantity(dto.Quantity);

            var previousProduct = await _productRepository.GetByIdAsync(order.ProductId);

            if (previousProduct == null)
                throw new InvalidOperationException("Mevcut siparise ait urun bulunamadi.");

            previousProduct.StockQuantity += order.Quantity;

            Product targetProduct;

            if (order.ProductId == dto.ProductId)
            {
                targetProduct = previousProduct;
            }
            else
            {
                targetProduct = await _productRepository.GetByIdAsync(dto.ProductId)
                    ?? throw new InvalidOperationException("Urun bulunamadi.");
            }

            EnsureEnoughStock(targetProduct, dto.Quantity);

            var unitPrice = GetUnitPrice(targetProduct);
            var totalPrice = unitPrice * dto.Quantity;

            targetProduct.StockQuantity -= dto.Quantity;

            order.ProductId = dto.ProductId;
            order.UserId = dto.UserId;
            order.Quantity = dto.Quantity;
            order.UnitPrice = unitPrice;
            order.TotalPrice = totalPrice;
            order.CustomerName = dto.CustomerName;
            order.CustomerPhone = dto.CustomerPhone;
            order.CustomerAddress = dto.CustomerAddress;

            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();
        }

        // Siparis sil
        public async Task DeleteAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);

            if (order == null)
                return;

            _orderRepository.Delete(order);
            await _orderRepository.SaveChangesAsync();
        }

        private static void ValidateQuantity(int quantity)
        {
            if (quantity <= 0)
                throw new ArgumentException("Siparis adedi 0'dan buyuk olmalidir.");
        }

        private static void EnsureEnoughStock(Product product, int quantity)
        {
            if (product.StockQuantity < quantity)
                throw new InvalidOperationException("Urun stogu siparis adedini karsilamiyor.");
        }

        private static decimal GetUnitPrice(Product product)
        {
            return product.DiscountPrice ?? product.Price;
        }
    }
}
