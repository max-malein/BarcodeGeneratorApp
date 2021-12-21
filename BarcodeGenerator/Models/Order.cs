
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace BarcodeGenerator.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public IEnumerable<OrderItem> OrderItems { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EditedAt { get; set; }
    }
}
