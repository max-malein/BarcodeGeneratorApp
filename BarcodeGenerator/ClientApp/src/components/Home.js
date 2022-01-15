import { useEffect, useState } from 'react'
import { OrderList } from './OrderList'

export function Home() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hookOrders, setOrders] = useState(null)

    //fetch('api/orders')
    //    .then(res => console.log(res.json()))

    useEffect(() => {
        fetch('api/orders')
            .then(res => res.json())
            .then(o => {
                console.log("fetch: ", o)
                setIsLoaded(true)
                setOrders(o)
            })
    },[])
    

    let orderList = <div className='loader'>Loading...</div>
    if (hookOrders) {
        if (hookOrders.length > 0) {
            console.log('order type: ', typeof hookOrders)
            console.log('order object: ', hookOrders)
            orderList = <OrderList orders={hookOrders} />
        } else {
            orderList = <div></div>
        }
    }

    return (
        <div>
            <h1>Pavluque Order Generator</h1>
            <button className="btn">Создать новый заказ</button>
            {orderList}
        </div>
        )
}

async function getOrderList() {
    let response = await fetch('api/orders')
    let result = await response.json()
    return result
}

