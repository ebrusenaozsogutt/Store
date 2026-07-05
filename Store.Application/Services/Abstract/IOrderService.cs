using Store.Application.DTOs.Order;

namespace Store.Application.Services.Abstract
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetAllAsync();

        Task<OrderDto?> GetByIdAsync(int id);

        Task<decimal> GetTotalRevenueAsync();

        Task AddAsync(CreateOrderDto dto);

        Task UpdateAsync(UpdateOrderDto dto);

        Task DeleteAsync(int id);
    }
}
