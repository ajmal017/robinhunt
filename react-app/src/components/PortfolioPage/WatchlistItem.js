import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

const WatchlistItem = ({ stock }) => {

    const [price, setPrice] = useState(null)

    const getPrice = async (ticker) => {
        let res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c27ut2aad3ic393ffql0`, { json: true })
        let data = await res.json() // returns promise for loadPrices function
        return data.c
    }
    let newPrice;
    const loadPrices = async(ticker) => {
        let newPrice = await getPrice(ticker)
        setPrice(newPrice)
    }
    useEffect(() => {
        loadPrices(stock)
    },[stock, price])

    return (
        <div className='watchlist-item'>
            <div>
                <p><a href={`/stocks/${stock}`}>{stock}</a></p>
            </div>
            <div>
                <p>${Number(price).toFixed(2)}</p>
            </div>
        </div>
    )
}

export default WatchlistItem;