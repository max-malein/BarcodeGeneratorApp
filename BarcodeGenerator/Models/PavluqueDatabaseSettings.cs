namespace BarcodeGenerator.Models
{
    public interface IPavluqueDatabaseSettings
    {
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
        string OrdersCollectionName { get; set; }
    }

    public class PavluqueDatabaseSettings : IPavluqueDatabaseSettings
    {
        public string OrdersCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
