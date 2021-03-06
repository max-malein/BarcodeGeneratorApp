export function OrderList({ orders }) {
    if (orders) {
        const listOfOrders = orders.map(o => {
            return (
                <li key={o.orderId} className="row">
                    <div className='col'>
                        {o.orderId}
                    </div>
                    <div className='col'>
                        {calculateTotalItems(o)} шт.
                    </div>
                    <div className='col'>
                        {calculateTotalPrice(o)} руб.
                    </div>
                    <div className='col'>
                        {new Date(o.editedAt).toLocaleDateString('ru-RU')}
                    </div>
                    <div className='col'>
                        <a href={'/orders/' + o.orderId} name={o.OrderId}>Редактировать</a>
                    </div>
                    <div className='col'>
                        <a href='/' name={o.OrderId}>Удалить</a>
                    </div>
                </li>
                )            
        })

        const headers = <li key={-1} className="row fw-bold mb-2">
            <div className='col'>
                Номер заказа
            </div>
            <div className='col'>
                Количество
            </div>
            <div className='col'>
                Сумма
            </div>
            <div className='col'>
                Изменен
            </div>
            <div className='col'>
                
            </div>
            <div className='col'>
                
            </div>
        </li>

        return (
            <div id="list of orders">
                    <h2>Заказы</h2>
                <ul>
                    {headers}
                    {listOfOrders}
                </ul>
            </div>
            )
    }    
}

function calculateTotalItems(order) {
    let sum = 0
    order.orderItems.forEach(o => sum += o.qty)
    return sum
}

function calculateTotalPrice(order) {
    let sum = 0
    order.orderItems.forEach(o => sum += (o.qty * o.price))
    return sum
}