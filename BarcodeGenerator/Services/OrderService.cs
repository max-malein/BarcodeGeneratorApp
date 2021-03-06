using BarcodeGenerator.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace BarcodeGenerator.Services
{
    public class OrderService
    {
        private readonly IMongoCollection<Order> _orders;

        public OrderService(IPavluqueDatabaseSettings dbSettings)
        {
            var client = new MongoClient(dbSettings.ConnectionString);
            var db = client.GetDatabase(dbSettings.DatabaseName);

            _orders = db.GetCollection<Order>(dbSettings.OrdersCollectionName);
        }

        public async Task<Order> GetAsync(ObjectId id)
        {
            var filter = Builders<Order>.Filter.Eq(o => o.Id, id);
            return await _orders.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<Order> GetAsync(int orderId)
        {
            var filter = Builders<Order>.Filter.Eq(o => o.OrderId, orderId);
            return await _orders.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<bool> AddAsync(Order order)
        {
            if (order is null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            // новый заказ
            try
            {
                await _orders.InsertOneAsync(order);
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _orders.Find(_ => true).ToListAsync();
        }

        public async Task<int> GetNextOrderNumberAsync()
        {
            var orders = await _orders.Find(_ => true).ToListAsync();
            if (orders.Any())
            {
                return orders.Max(o => o.OrderId) + 1;
            }
            else
            {
                return 0;
            }
            
        }

        public async Task<bool> ReplaceAsync(Order order)
        {
            if (order is null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            var existingOrder = await GetAsync(order.OrderId);
            if (existingOrder != null)
            {
                existingOrder.OrderItems = order.OrderItems;
                existingOrder.EditedAt = DateTime.Now;
                var result = await _orders.ReplaceOneAsync(Builders<Order>.Filter.Eq(o => o.Id, existingOrder.Id), existingOrder);
                return result.IsAcknowledged;
            }

            return false;
        }

        public async Task<bool> UpsertAsync(Order order)
        {
            if (order is null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            if (await GetAsync(order.OrderId) != null)
            {
                return await ReplaceAsync(order);
            }
            else
            {
                return await AddAsync(order);
            }
        }

        
    }
}
