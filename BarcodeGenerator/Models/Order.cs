using MongoDB.Bson;

namespace BarcodeGenerator.Models
{
    public class Order
    {
        public ObjectId Id { get; set; }
        public int OrderId { get; set; }
        public IEnumerable<OrderItem>? OrderItems { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EditedAt { get; set; }
    }
}
