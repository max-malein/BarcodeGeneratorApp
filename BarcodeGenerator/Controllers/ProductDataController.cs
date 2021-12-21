using BarcodeGenerator.Models;
using Microsoft.AspNetCore.Mvc;

namespace BarcodeGenerator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProductDataController : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<IEnumerable<OrderItem>> Get(string id)
        {
            throw new NotImplementedException();
        }
    }
}
