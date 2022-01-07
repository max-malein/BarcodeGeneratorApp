import { Button, Form } from "reactstrap"
import { TestOrderData } from "../Data/TestData"
import ProductData from "../Data/Products"
import { useState } from "react"
import { type } from "jquery"

export function BarcodeGenerator() {
    const initialData = TestOrderData
    const [formData, setFormData] = useState(initialData)

    // обновить ряд в форме
    function setRowData(row, index){
        let nextForm = formData.map((f, i) => {
            if (i === index){
                return row
            }else{
                return f
            }
        })
        setFormData(nextForm)
    }

    function deleteRow(index)
    {
        const nextForm = formData.filter((d, i) => index !== i)
        setFormData(nextForm)
    }

    function handleAddRow(e)
    {
        e.preventDefault()

        if (formData.length > 0) {
            const lastItem = formData[formData.length - 1]
            let newItem = { ...lastItem, Size: nextSize(lastItem.Size, lastItem.Type) }
            newItem.Sku = GenerateSku(newItem)
            setFormData([...formData, newItem])
        }
        else { // вообще ничего еще не добавлено
            var product = ProductData.Products[0]
            const newItem = {
                Sku: product.Sku,
                Type: product.Type,
                Size: product.Sizes[0],
                Price: product.Price,
                Qty: 1
            }

            setFormData([...formData, newItem])
        }
    }

    async function handleSubmitForm() {
        const response = await fetch('api/saveorder', {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            }
        });
        //const response = await fetch('weatherforecast');
        const data = await response.text();
        console.log(data)
    }
    

    let inputRows = formData.map((row, i) => {
        // заполнить инфу для этого ряда
        return (
            <InputRow key={i} row={row} rowIndex={i} productData={ProductData.Products} setRowData={setRowData} deleteRow={deleteRow}/>
        )
    })

    return (
        <>
            <h1 className="mb-5">Barcode Generator 3.0</h1>
            <div id='main-table'>
                <Form>{inputRows}</Form>
                <div className="row">
                    <div className="col-2 mb-5">
                        <Button className="btn-light w-100 text-start" onClick={handleAddRow}>+ Добавить ряд</Button>
                    </div>
                </div>
                <Button onClick={handleSubmitForm}>Сохранить заказ</Button>
            </div>
        </>
    )
}

function InputRow({ 
    row,
    rowIndex,
    productData, 
    setRowData, 
    deleteRow 
}) {

    //const [rowData, setRowData] = useState(row)
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

    function handleTypeChange(e) {
        const productType = e.target.value
        const productSize = tryGetSameSize(productType, row.Size)
        const productPrice = getPriceByType(productType)
        let updatedRowData = { ...row, Type: e.target.value, Size: productSize, Price: productPrice }

        updatedRowData.Sku = GenerateSku(updatedRowData)
        setRowData(updatedRowData, rowIndex)
    }

    function handleSizeChange(e) {
        let updatedRowData = { ...row, [e.target.name]: e.target.value }

        updatedRowData.Sku = GenerateSku(updatedRowData)
        setRowData(updatedRowData, rowIndex)
    }

    function handleSimpleInputChange(e) {
        setRowData({ ...row, [e.target.name]: e.target.value }, rowIndex)
    }

    function handleRemoveRow(){
        deleteRow(rowIndex)
    }

    function tryGetSameSize(productType, productSize) {
        let product = ProductData.Products.find(p => p.Type === productType)
        if (product.Sizes.includes(productSize)) {
            return productSize
        } else {
            return product.Sizes[0]
        }
    }

    return (
        <div className="row mb-3 input-row" >
            <div className="col-2">
                <input type="text" placeholder="Артикул" className="form-control product-sku" name="Sku" value={row.Sku} onChange={handleSkuChange} />
            </div>
            <div className="col">
                <select className="form-select product-name product-input" name="Type" value={row.Type} onChange={handleTypeChange} >
                    <option>Наименование</option>
                    {productOptions}
                </select>
            </div>
            <div className="col-2">
                <select className="form-select product-size product-input" name="Size" value={row.Size} onChange={handleSizeChange}>
                    <option>Размер</option>
                    {sizeOptions}
                </select>
            </div>
            <div className="col-2">
                <input type="number" placeholder="Цена" className="form-control product-price" name="Price" value={row.Price} onChange={handleSimpleInputChange} />
            </div>
            <div className="col-1">
                <input type="number" className="form-control product-quantity product-input" value={row.Qty} name="Qty" onChange={handleSimpleInputChange} />
            </div>
            <div className="col-1">
                <button type="button" className="btn btn-outline-primary" onClick={handleRemoveRow}>-</button>
            </div>
        </div>
    )
}

function getPriceByType(productType) {
    const product = ProductData.Products.find(p => p.Type === productType)
    if (product) {
        return product.Price
    } else {
        return 0
    }
}

function GenerateSku(rData) {
    let sku = ''
    if (rData.Type) {
        let prod = ProductData.Products.find(p => p.Type === rData.Type)
        if (prod) {
            sku = prod.Sku
        }
    }

    if (rData.Size) {
        sku += `-${rData.Size}`
    }

    return sku
}

function nextSize(currentSize, type){
    const sizes = ProductData.Products.find(p => p.Type === type).Sizes
    for(let i=0; i< sizes.length; i++){
        if (sizes[i] === currentSize) {
            return sizes[(i + 1) % sizes.length]
        }
    }

    console.error("не найден размер ", currentSize)
    return currentSize
}