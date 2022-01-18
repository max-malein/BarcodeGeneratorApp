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
        private readonly IConfiguration configuration;
        private readonly OrderService orderService;

        public OrdersController(ILogger<OrdersController> logger, IConfiguration configuration, OrderService orderService)
        {
            this.logger = logger;
            this.configuration = configuration;
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
        [Route("barcodes/{id}")]
        public async Task<IActionResult> CreateBarcodes(List<OrderItem> orderItems, int id)
        {
            string templateFileName = configuration.GetSection("TemplateFiles").GetValue<string>("Barcodes");
            string templatePath = Path.Combine("Templates", templateFileName);
            //string templatePath = templateFileName;
            byte[] file = await ExcelService.CreateBarcodes(templatePath, orderItems);
            string file_type = "application/xlsx";
            string file_name = $"Order_{id}_stickers.xlsx";
            return File(file, file_type, file_name);
        }

        [HttpPost]
        [Route("order/{id}")]
        public async Task<IActionResult> CreateOrder(List<OrderItem> orderItems, int id)
        {
            string templateFileName = configuration.GetSection("TemplateFiles").GetValue<string>("Order");
            string templatePath = Path.Combine("Templates", templateFileName);
            //string templatePath = templateFileName;
            byte[] file = await ExcelService.CreateOrder(templatePath, orderItems);
            string file_type = "application/xlsx";
            string file_name = $"Order_{id}.xlsx";
            return File(file, file_type, file_name);
        }

        [HttpGet]
        [Route("barcodes/{id}")]
        public async Task<IEnumerable<Order>> GetBar(int id)
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
