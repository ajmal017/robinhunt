import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTrades } from '../../store/trade'

const PortfolioContent = ({ user, cashBalance, trades }) => {    

    return (
        <div className='portfolio-content-container'>
            <div className="chart-container">
                <h2>Cash Balance: ${cashBalance}</h2>
            </div>
            <div className="holdings-container">
                <h2>Portfolio Holdings</h2>
                { trades && trades.map(trade => (
                    <div key={`trade_id_${trade.id}`}>Ticker: {trade.ticker} | Price: {trade.order_price} | Qty: {trade.order_volume}</div>
                ))}
            </div>
            <div className="news-container">
                <h2>Market News</h2>
            </div>
        </div>
    )
}

export default PortfolioContent;