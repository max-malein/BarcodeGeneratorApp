using OfficeOpenXml;

namespace BarcodeGenerator.Models
{
    public class ExcelService
    {
        public static async Task<byte[]> CreateBarcodes(string fileName, List<OrderItem> productData)
        {
            FileInfo fileInfo = new FileInfo(fileName);
            ExcelPackage p = new ExcelPackage(fileInfo);
            ExcelWorksheet myWorksheet = p.Workbook.Worksheets["Лист1"];
            var row = 1;
            var col = 1;
            foreach (OrderItem product in productData)
            {
                myWorksheet.Cells[row, col].Value = product.Size;
                myWorksheet.Cells[row + 1, col].Value = product.Type;
                myWorksheet.Cells[row + 2, col].Value = Code128Generator.Encode(product.Sku);
                myWorksheet.Cells[row + 3, col].Value = product.Sku;
                myWorksheet.Cells[row + 4, col].Value = "Артикул: PAV" + product.Sku.Split('-')[0];
                myWorksheet.Cells[row + 5, col].Value = "Размер - " + product.Size;

                NextCell(ref row, ref col);
            }

            return await p.GetAsByteArrayAsync();
        }

        private static void NextCell(ref int row, ref int col)
        {
            if (col == 7)
            {
                col = 1;
                row += 7;
            }
            else
            {
                col += 2;
            }
        }

        public static async Task<byte[]> CreateOrder(string fileName, List<OrderItem> productData)
        {

            FileInfo fileInfo = new FileInfo(fileName);
            ExcelPackage p = new ExcelPackage(fileInfo);
            ExcelWorksheet myWorksheet = p.Workbook.Worksheets["Заказ"];
            var row = 2;
            foreach (OrderItem product in productData)
            {
                myWorksheet.Cells[row, 1].Value = product.Sku;
                myWorksheet.Cells[row, 2].Value = product.Qty;

                row++;
            }
            //p.SaveAs(new FileInfo(saveAsPath));
            return await p.GetAsByteArrayAsync();
            //p.Save();
        }
    }
}
