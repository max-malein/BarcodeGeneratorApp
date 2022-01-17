using BarcodeGenerator.Models;
using BarcodeGenerator.Services;
using BarcodeGeneratorBackend;
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

        [HttpPost]
        [Route("barcodes")]
        public async Task<IActionResult> CreateBarcodes(List<OrderItem> orderItems)
        {
            //string path = Path.Combine(_appEnvironment.ContentRootPath, "Files/book.pdf");
            //FileStream fs = new FileStream(path, FileMode.Open);
            //string file_type = "application/xlsx";
            //string file_name = "order.xlsx";
            //return File(fs, file_type, file_name);
            return Ok();
        }

        [HttpGet]
        public async Task<IEnumerable<Order>> Get()
        {
            //Thread.Sleep(2000);
            //ExcelWriter.SaveBarcodes()
            return await orderService.GetAllAsync();
        }

        [HttpGet("{orderId}")]
        public async Task<Order> Get(int orderId)
        {
            //Thread.Sleep(2000);
            var order = await orderService.GetAsync(orderId);
            return order;
        }

        [HttpGet]
        [Route("nextAvailableOrderNumber")]
        public async Task<int> GetNewOrderNumber()
        {
            var orderNumber = await orderService.GetNextOrderNumberAsync();
            return orderNumber;
        }
    }
}
