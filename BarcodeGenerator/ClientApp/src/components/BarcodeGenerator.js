import { Form } from "reactstrap"
import { TestOrderData } from "../Data/TestData"
import ProductData from "../Data/Products"
import { useState } from "react"

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
        if(formData.length > 0)
        {
            const lastItem = formData[formData.length -1]
            const newItem = {...lastItem, Size: nextSize(lastItem.Size, lastItem.Type)}
            setFormData([...formData, newItem])

        }
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
                <p className="link-secondary" onClick={handleAddRow}>Добавить ряд</p>
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

    function handleInputChange(e) {
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
                <input type="text" placeholder="Артикул" className="form-control product-sku" name="Sku" value={row.Sku} onChange={handleSkuChange} />
            </div>
            <div className="col">
                <select className="form-select product-name product-input" name="Type" value={row.Type} onChange={handleInputChange} >
                    <option>Наименование</option>
                    {productOptions}
                </select>
            </div>
            <div className="col-2">
                <select className="form-select product-size product-input" name="Size" value={row.Size} onChange={handleInputChange}>
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

function nextSize(currentSize, type){
    const sizes = ProductData.Products.find(p => p.Type === type).Sizes
    for(let i=0; i< sizes.length; i++){
        if (sizes[i] === currentSize){
            return sizes[i+1 % sizes.length]
        }
    }

    console.error("не найден размер ", currentSize)
    return currentSize
}