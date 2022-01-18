using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace BarcodeGenerator.Models
{
    public class OrderItem
    {
        public string Sku { get; set; }
        public string Type { get; set; }
        public string Size { get; set; }
        public double Price { get; set; }
        public int Qty { get; set; }

        public string Encode()
        {
            return Code128Generator.Encode(Sku);
        }
    }
}
