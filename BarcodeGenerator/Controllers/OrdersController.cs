using BarcodeGenerator.Models;
using BarcodeGenerator.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BarcodeGenerator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ILogger<OrdersController> logger;
        private readonly OrderService orderService;

        public OrdersController(ILogger<OrdersController> logger, OrderService orderService)
        {
            this.logger = logger;
            this.orderService = orderService;
        }

        [HttpPost]
        [Route("{orderId?}")]
        public async Task<bool> Save(List<OrderItem> orderItems, int orderId = -1)
        {
            var order = new Order()
            {
                CreatedAt = DateTime.Now,
                EditedAt = DateTime.Now,
                OrderItems = orderItems,
            };

            if (orderId == -1)
            {
                order.OrderId = await orderService.GetNextOrderNumberAsync();
                return await orderService.AddAsync(order);
            }
            else
            {
                order.OrderId = orderId;
                return await orderService.UpsertAsync(order);
            }
        }

        [HttpGet]
        public async Task<IEnumerable<Order>> Get()
        {
            //Thread.Sleep(2000);
            return await orderService.GetAllAsync();
        }
    }
}
