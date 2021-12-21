using BarcodeGenerator.Models;
using BarcodeGenerator.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BarcodeGenerator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly ILogger<OrderController> logger;
        private readonly OrderService orderService;

        public OrderController(ILogger<OrderController> logger, OrderService orderService)
        {
            this.logger = logger;
            this.orderService = orderService;
        }

        [HttpPost]
        [Route("{id?}")]
        public async Task<bool> Save(List<OrderItem> orderItems, string id = "new")
        {
            var order = new Order()
            {
                CreatedAt = DateTime.Now,
                EditedAt = DateTime.Now,
                OrderItems = orderItems,
            };

            if (id != "new")
                order.Id = id;

            return await orderService.UpsertAsync(order);
        }
    }
}
