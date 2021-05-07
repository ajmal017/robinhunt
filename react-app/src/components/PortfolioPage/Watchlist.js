import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import WatchlistItem from './WatchlistItem';

const AssetHolding = ({watchlist}) => {

    // get watchlist items on page load, pass here

    let stock = 'AAPL'
    let price = 125.37

    return (
        <div>
            <div>
                <h4 className='watchlist-header'>Watchlist</h4>
            </div>
            <div>
                <WatchlistItem stock={stock} price={price}/>
                <WatchlistItem stock={stock} price={price} />
                <WatchlistItem stock={stock} price={price} />
                <WatchlistItem stock={stock} price={price}/>
                <WatchlistItem stock={stock} price={price} />
                <WatchlistItem stock={stock} price={price} />
            </div>
        </div>
    )
}

export default AssetHolding;