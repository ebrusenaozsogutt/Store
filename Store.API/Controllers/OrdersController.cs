using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.Order;
using Store.Application.Services.Abstract;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // Tüm siparişleri getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        // Id'ye göre sipariş getir
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _orderService.GetByIdAsync(id);

            if (order == null)
                return NotFound("Sipariş bulunamadı.");

            return Ok(order);
        }

        // Yeni sipariş ekle
        [HttpPost]
        public async Task<IActionResult> Add(CreateOrderDto dto)
        {
            await _orderService.AddAsync(dto);

            return Ok("Sipariş başarıyla oluşturuldu.");
        }

        // Sipariş güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateOrderDto dto)
        {
            dto.Id = id;

            await _orderService.UpdateAsync(dto);

            return Ok("Sipariş başarıyla güncellendi.");
        }

        // Sipariş sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _orderService.DeleteAsync(id);

            return Ok("Sipariş başarıyla silindi.");
        }
    }
}