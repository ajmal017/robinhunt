import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import WatchlistItem from './WatchlistItem';

const Watchlist = ({watchlist}) => {

    // get watchlist items on page load, pass here

    let stock = 'AAPL'
    let price = 125.37

    return (
        <div>
            <div>
                <h4 className='watchlist-header'>Watchlist</h4>
            </div>
            <div>
                <WatchlistItem stock={'AAPL'} price={125.37}/>
                <WatchlistItem stock={'TSLA'} price={653.23} />
                <WatchlistItem stock={'FB'} price={321.58} />
                <WatchlistItem stock={'NFLX'} price={554.39}/>
                <WatchlistItem stock={'AMZN'} price={3312.89} />
            </div>
        </div>
    )
}

export default Watchlist;