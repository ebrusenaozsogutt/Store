using Microsoft.AspNetCore.Authorization;
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

        // Tum siparisleri getir
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(orders);
        }

        // Toplam ciroyu getir
        [Authorize(Roles = "Admin")]
        [HttpGet("revenue")]
        public async Task<IActionResult> GetRevenue()
        {
            var revenue = await _orderService.GetTotalRevenueAsync();
            return Ok(revenue);
        }

        // Id'ye gore siparis getir
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _orderService.GetByIdAsync(id);

            if (order == null)
                return NotFound("Siparis bulunamadi.");

            return Ok(order);
        }

        // Yeni siparis ekle
        [HttpPost]
        public async Task<IActionResult> Add(CreateOrderDto dto)
        {
            await _orderService.AddAsync(dto);

            return Ok("Siparis basariyla olusturuldu.");
        }

        // Siparis guncelle
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, UpdateOrderDto dto)
        {
            dto.Id = id;

            await _orderService.UpdateAsync(dto);

            return Ok("Siparis basariyla guncellendi.");
        }

        // Siparis sil
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _orderService.DeleteAsync(id);

            return Ok("Siparis basariyla silindi.");
        }
    }
}
