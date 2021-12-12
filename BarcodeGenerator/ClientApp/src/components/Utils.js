export function ParseInitialData(initialData)
{
    let json = []
    let rows = initialData.split('\n')
    rows.forEach(row => {
        let items = row.split(';')
        let product = {
            Type: items[0],
            Sku: items[1],
            Sizes: items[2].split(","),
            Price: parseInt(items[3])
        }

        json.push(product)
    });

    return json

}