using Store.Application.DTOs.Order;
using Store.Application.Interfaces.Repositories;
using Store.Application.Services.Abstract;
using Store.Domain.Entities;

namespace Store.Application.Services.Concrete
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;

        public OrderService(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        // Tüm siparişleri getir
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

        // Id'ye göre sipariş getir
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

        // Sipariş ekle
        public async Task AddAsync(CreateOrderDto dto)
        {
            var order = new Order
            {
                ProductId = dto.ProductId,
                UserId = dto.UserId,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                TotalPrice = dto.Quantity * dto.UnitPrice,
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                CustomerAddress = dto.CustomerAddress,
                CreatedAt = DateTime.Now
            };

            await _orderRepository.AddAsync(order);
            await _orderRepository.SaveChangesAsync();
        }

        // Sipariş güncelle
        public async Task UpdateAsync(UpdateOrderDto dto)
        {
            var order = await _orderRepository.GetByIdAsync(dto.Id);

            if (order == null)
                return;

            order.ProductId = dto.ProductId;
            order.UserId = dto.UserId;
            order.Quantity = dto.Quantity;
            order.UnitPrice = dto.UnitPrice;
            order.TotalPrice = dto.Quantity * dto.UnitPrice;
            order.CustomerName = dto.CustomerName;
            order.CustomerPhone = dto.CustomerPhone;
            order.CustomerAddress = dto.CustomerAddress;

            _orderRepository.Update(order);
            await _orderRepository.SaveChangesAsync();
        }

        // Sipariş sil
        public async Task DeleteAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);

            if (order == null)
                return;

            _orderRepository.Delete(order);
            await _orderRepository.SaveChangesAsync();
        }
    }
}