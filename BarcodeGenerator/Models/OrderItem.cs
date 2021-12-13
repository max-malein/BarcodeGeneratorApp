using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BarcodeGenerator.Model
{
    public class OrderItem
    {
        public ObjectId Id { get; set; }
        public string Sku { get; set; }
        public string Type { get; set; }
        public string Size { get; set; }
        public int Quantity { get; set; }

        public string Encode()
        {
            throw new NotImplementedException();
        }
    }
}
