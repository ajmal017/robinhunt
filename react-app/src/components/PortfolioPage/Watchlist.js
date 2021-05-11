import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WatchlistItem from './WatchlistItem';

const Watchlist = () => {

    const watchlist_items = useSelector(state => state.watchlist.watchlist_items)

    return (
            <div>

            { watchlist_items && watchlist_items.map((item,idx) => {
               return <WatchlistItem key={`${item}-${idx}`} stock={item.ticker} price={125.37}/>
            })}
            </div>
    )
}

export default Watchlist;
