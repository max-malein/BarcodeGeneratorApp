using BarcodeGenerator.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BarcodeGenerator.Controllers
{
    [ApiController]
    [Route("[controller]")]    
    public class SaveOrderController : ControllerBase
    {
        //[HttpPost]
        //public IActionResult Post([FromBody] List<OrderItem> orderItems)
        //{
        //    return Ok();
        //}
        public SaveOrderController(ILogger<SaveOrderController> logger)
        {

        }

        [HttpGet]
        public IEnumerable<WeatherForecast> Get()
        {
            //return "it works!";
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = "fuck"
            })
            .ToArray();
        }
    }
}
