import { Form } from "reactstrap"
import { TestOrderData } from "../Data/TestData"
import ProductData from "../Data/Products"
import { useState } from "react"

export function BarcodeGenerator() {
    //console.log(JSON.stringify(ParseInitialData(InitialProductData)))
    console.log(ProductData.Products)

    let rows = TestOrderData
    let inputRows = rows.map((row, i) => {
        // заполнить инфу для этого ряда
        return (
            <InputRow key={i} row={row} productData={ProductData.Products} />
        )
    })

    return (
        <>
            <h1 className="mb-5">Barcode Generator 3.0</h1>
            <div id='main-table'>
                <Form>{inputRows}</Form>
            </div>
        </>
    )
}

function InputRow({ row, productData }) {

    const [rowData, setRowData] = useState(row)
    let currentProduct = null
    let productOptions = productData.map((p, i) => {
        if (row.Type === p.Type) {
            currentProduct = p
        }
        return (<option key={i}>{p.Type}</option>)
    })

    let sizeOptions = []
    if (currentProduct) {
        sizeOptions = currentProduct.Sizes.map((s,i) => {
            return (<option key={i}>{s}</option>)
        })
    }

    function handleSkuChange(e) {
        //setRowData([e.target.name] = e.target.value)
    }

    function handleInputChange(e) {
        let updatedRowData = { ...rowData, [e.target.name]: e.target.value }
        updatedRowData.Sku = GenerateSku(updatedRowData)
        setRowData(updatedRowData)
    }

    function handleSimpleInputChange(e) {
        setRowData({ ...rowData, [e.target.name]: e.target.value })
    }

    function GenerateSku(rData) {
        let sku = ''
        if (rData.Type) {
            let prod = productData.find(p => p.Type === rData.Type)
            if (prod) {
                sku = prod.Sku
            }
        }

        if (rData.Size) {
            sku += `-${rData.Size}`
        }

        return sku
    }

    return (
        <div className="row mb-3 input-row" >
            <div className="col-2">
                <input type="text" placeholder="Артикул" className="form-control product-sku" name="Sku" value={rowData.Sku} onChange={handleSkuChange} />
            </div>
            <div className="col">
                <select className="form-select product-name product-input" name="Type" value={rowData.Type} onChange={handleInputChange} >
                    <option>Наименование</option>
                    {productOptions}
                </select>
            </div>
            <div className="col-2">
                <select className="form-select product-size product-input" name="Size" value={rowData.Size} onChange={handleInputChange}>
                    <option>Размер</option>
                    {sizeOptions}
                </select>
            </div>
            <div className="col-2">
                <input type="number" placeholder="Цена" className="form-control product-price" name="Price" value={rowData.Price} onChange={handleSimpleInputChange} />
            </div>
            <div className="col-1">
                <input type="number" className="form-control product-quantity product-input" value={rowData.Qty} name="Qty" onChange={handleSimpleInputChange} />
            </div>
            <div className="col-1">
                <button type="button" className="btn btn-outline-primary">-</button>
            </div>
        </div>
    )
}