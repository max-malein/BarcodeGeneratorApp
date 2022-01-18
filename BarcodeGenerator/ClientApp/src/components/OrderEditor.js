import { Button, Form, Row } from "reactstrap"
import { TestOrderData } from "../Data/TestData"
import ProductData from "../Data/Products"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export function OrderEditor() {
    const [formData, setFormData] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(null)
    const [orderNumber, setOrderNumber] = useState(0)

    const params = useParams()
    const orderId = params.id

    useEffect(() => {
        if (orderId !== 'new') {
            fetch(`/api/orders/${orderId}`)
                .then(response => {
                    console.log("статус ответа: ", response.status)
                    if (response.status === 204) {
                        console.log('response is ok!!! ', response.status)
                        return { orderItems: [] }
                    } else if (response.ok) {
                        return response.json()
                    }
                    else {
                        throw Error(response.statusText)
                    }
                })
                .then(order => {
                    console.log("order: ", order)
                    setFormData(order.orderItems)
                })
                .catch(error => setError(error))
                .finally(() => {
                    setIsLoaded(true)
                    setOrderNumber(orderId)
                })

        } else { // новый заказ
            fetch('/api/orders/nextAvailableOrderNumber')
                .then(response => {
                    if (response.ok) {
                        return response.text()
                    }
                    throw Error(response.statusText)
                })
                .then(num => {
                    setOrderNumber(num)
                })
                .catch(error => setOrderNumber('???'))
                .finally(() => setIsLoaded(true))
        }
    }, [])

    function handleOrderNumberChange(e) {
        setOrderNumber(e.target.value)
    }

    if (isLoaded === false) {
        return (<div>Loading...</div>)
    } else if (error) {
        return (<div>ОШИБКА: {error}</div>)
    } else {
        let inputRows = formData.map((row, i) => {
            // заполнить инфу для этого ряда
            return (
                <InputRow key={i} row={row} rowIndex={i} productData={ProductData.Products} setRowData={setRowData} deleteRow={deleteRow} />
            )
        })

        return (
            <>
                <div id='header' className="row row-cols-auto mb-3">
                    <h1 className="col">Редактор заказа </h1><input className='col-lg-1 col-2 h1' type="number" value={orderNumber} onChange={handleOrderNumberChange} />
                </div>
                <hr className="mt-3 mb-3"></hr>
                <div id='main-table'>
                    <Form>{inputRows}</Form>
                    <div className="row">
                        <div className="col-2 mb-5">
                            <Button className="btn-light w-100 text-start" onClick={handleAddRow}>+ Добавить ряд</Button>
                        </div>
                    </div>
                    <Button onClick={handleSave}>Сохранить заказ</Button>
                    <Button onClick={handleStickers}>Скачать наклейки</Button>
                    <Button onClick={handleOrderDownload}>Скачать заказ</Button>
                </div>
            </>
        )
    }

    // обновить ряд в форме
    function setRowData(row, index) {
        let nextForm = formData.map((f, i) => {
            if (i === index) {
                return row
            } else {
                return f
            }
        })
        setFormData(nextForm)
    }

    function deleteRow(index) {
        const nextForm = formData.filter((d, i) => index !== i)
        setFormData(nextForm)
    }

    function handleAddRow(e) {
        e.preventDefault()
        console.log(formData)

        if (formData.length > 0) {
            const lastItem = formData[formData.length - 1]
            let newItem = { ...lastItem, size: nextSize(lastItem.size, lastItem.type) }
            newItem.sku = GenerateSku(newItem)
            setFormData([...formData, newItem])
        }
        else { // вообще ничего еще не добавлено
            var product = ProductData.Products[0]
            const newItem = {
                sku: product.sku,
                type: product.type,
                size: product.sizes[0],
                price: product.price,
                qty: 1
            }

            setFormData([...formData, newItem])
        }
    }

    async function handleSave() {
        const response = await fetch(`api/orders/${orderNumber}`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-type": "application/json",
            }
        });
        //const response = await fetch('weatherforecast');
        const data = await response.text();
    }

    async function handleStickers() {
        console.log(formData)
        const response = await fetch(`api/orders/barcodes/${orderNumber}`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-type": "application/json",
            }
        });

        let blob = await response.blob()

        downloadFile(blob, `Stikers ${orderNumber}.xlsx`)
    }

    async function handleOrderDownload() {
        console.log(formData)
        const response = await fetch(`api/orders/order/${orderNumber}`, {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-type": "application/json",
            }
        });

        let blob = await response.blob()

        downloadFile(blob, `Stikers ${orderNumber}.xlsx`)
    }
}

function downloadFile(blob, fileName) {
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([blob]))
    console.log('url: ', url)
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
        'download',
        fileName,
    );

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode.removeChild(link);
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
        if (row.type === p.type) {
            currentProduct = p
        }
        return (<option key={i}>{p.type}</option>)
    })

    let sizeOptions = []
    if (currentProduct) {
        sizeOptions = currentProduct.sizes.map((s, i) => {
            return (<option key={i}>{s}</option>)
        })
    }

    function handleskuChange(e) {
        //setRowData([e.target.name] = e.target.value)
    }

    function handleTypeChange(e) {
        const producttype = e.target.value
        const productsize = tryGetSamesize(producttype, row.size)
        const productprice = getPriceByType(producttype)
        let updatedRowData = { ...row, type: e.target.value, size: productsize, price: productprice }

        updatedRowData.sku = GenerateSku(updatedRowData)
        setRowData(updatedRowData, rowIndex)
    }

    function handleSizeChange(e) {
        let updatedRowData = { ...row, [e.target.name]: e.target.value }

        updatedRowData.sku = GenerateSku(updatedRowData)
        setRowData(updatedRowData, rowIndex)
    }

    function handleSimpleInputChange(e) {
        setRowData({ ...row, [e.target.name]: e.target.value }, rowIndex)
    }

    function handleRemoveRow() {
        deleteRow(rowIndex)
    }

    function tryGetSamesize(producttype, productsize) {
        let product = ProductData.Products.find(p => p.type === producttype)
        if (product.sizes.includes(productsize)) {
            return productsize
        } else {
            return product.sizes[0]
        }
    }

    return (
        <div className="row mb-3 input-row" >
            <div className="col-2">
                <input type="text" placeholder="Артикул" className="form-control product-sku" name="sku" value={row.sku} onChange={handleskuChange} />
            </div>
            <div className="col">
                <select className="form-select product-name product-input" name="type" value={row.type} onChange={handleTypeChange} >
                    <option>Наименование</option>
                    {productOptions}
                </select>
            </div>
            <div className="col-2">
                <select className="form-select product-size product-input" name="size" value={row.size} onChange={handleSizeChange}>
                    <option>Размер</option>
                    {sizeOptions}
                </select>
            </div>
            <div className="col-2">
                <input type="number" placeholder="Цена" className="form-control product-price" name="price" value={row.price} onChange={handleSimpleInputChange} />
            </div>
            <div className="col-1">
                <input type="number" className="form-control product-quantity product-input" value={row.qty} name="qty" onChange={handleSimpleInputChange} />
            </div>
            <div className="col-1">
                <button type="button" className="btn btn-outline-primary" onClick={handleRemoveRow}>-</button>
            </div>
        </div>
    )
}

function getPriceByType(productType) {
    const product = ProductData.Products.find(p => p.type === productType)
    if (product) {
        return product.price
    } else {
        return 0
    }
}

function GenerateSku(rData) {
    let sku = ''
    if (rData.type) {
        let prod = ProductData.Products.find(p => p.type === rData.type)
        if (prod) {
            sku = prod.sku
        }
    }

    if (rData.size) {
        sku += `-${rData.size}`
    }

    return sku
}

function nextSize(currentsize, type) {
    let prods = ProductData.Products
    const sizes = ProductData.Products.find(p => p.type === type).sizes
    for (let i = 0; i < sizes.length; i++) {
        if (sizes[i] === currentsize) {
            return sizes[(i + 1) % sizes.length]
        }
    }

    console.error("не найден размер ", currentsize)
    return currentsize
}

async function getOrder(orderId) {
    const response = await fetch(`/api/orders/${orderId}`)
    console.log('response: ', response)
    if (response.status !== 204) {
        const order = await response.json()
        return order
    } else {
        return null
    }

}