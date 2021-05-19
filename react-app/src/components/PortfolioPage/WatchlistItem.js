import React, { useEffect, useState } from "react";

const WatchlistItem = ({ stock }) => {
    const dashed = require('../../front-assets/dashed.png')
    const [price, setPrice] = useState(null)
    const [netChange, setNetChange] = useState(null)
    const [changeColor, setChangeColor] = useState('var(--GREEN_TEXT)')

    const getPrice = async (ticker) => {
        let res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c27ut2aad3ic393ffql0`, { json: true })
        let data = await res.json()
        return data 
    }
    let newPrice;
    const loadPrices = async(ticker) => {
        let quote = await getPrice(ticker)
        let current = quote.c // c = current, o = open
        let change = ((quote.c - quote.o)/(quote.o))*100
        setPrice(current)
        setNetChange(change)
        if(change < 0){
            setChangeColor('var(--RED_TEXT)')
        }
    }
    useEffect(() => {
        loadPrices(stock)
    },[stock, price])

    return (
        <a href={`/stocks/${stock}`}>
            <div className='watchlist-item'>
                <div>
                    <p style={{'paddingTop':'18px', 'color':'var(--GREEN_TEXT)'}}>{stock}</p>
                </div>
                <img style={{'height':'40px', 'width':'50px', 'paddingTop':'5px'}} src={dashed}></img>
                <div className='watchlist-item-price'>
                    <p>${Number(price).toFixed(2)}</p>
                    <p style={{'color':`${changeColor}`}}>{Number(netChange).toFixed(2)}%</p>
                </div>
            </div>
        </a>
    )
}

export default WatchlistItem;