import React from "react";

// intentionally saved this component outside the Portfolio folder in order to apply on stock profile page later
const LedgerItem = ({ trade }) => {
    let fDate, total, fTime = "";
    let color = 'var(--GREEN_TEXT)'
    if(trade){
        let obj = new Date(trade.timestamp);
        fDate = obj.toDateString().slice(4); // Returns 'Sun May 16 2021'; use slice to cut the day from front
        fTime = `${obj.toLocaleTimeString('en-US').slice(0, -6)}  ${obj.toLocaleTimeString().slice(-2)}`
        total = `${(trade.order_price * trade.order_volume).toFixed(2)}`
        if(trade.order_type === 'buy') color = 'var(--RED_TEXT)'
    }
    
    return (
        <a href={`/stocks/${trade.ticker}`}>
            <div className="ledger-item-container">
                <div className='flex-container-between ledger-item-summary'>
                    <p>{trade.ticker}: Market {trade.order_type}</p>
                    <p style={{'color':`${color}`}}>${total}</p>
                </div>
                <div className='flex-container-between ledger-item-detail'>
                    <p>{fDate}, {fTime}</p>
                    { trade.order_volume === 1 ?
                        (<p>{trade.order_volume} share at ${trade.order_price.toFixed(2)}</p>) :
                        (<p>{trade.order_volume} shares at ${trade.order_price.toFixed(2)}</p>)
                    }
                </div>
            </div>
        </a>
    )
}

export default LedgerItem;