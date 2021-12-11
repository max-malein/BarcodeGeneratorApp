export function BarcodeGenerator() {
    let rows = [1, 2, 3]
    return (
        <>
            <h1>Barcode Generator 3.0</h1>
            <div id='main-table'>
            {rows.map(row => {
                return (
                    <InputRow row={row} />
                )
            })}
            </div>
        </>
    )
}

function InputRow({ row }) {
    return (
        <p>{'номер ' + row}</p>)
}