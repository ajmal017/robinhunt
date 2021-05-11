import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loadTrades } from '../../store/trade'

const AssetHolding = ({ symbol, shares, purchasePrice, currentPrice, equityObj, currencyFormatter }) => {

    //raw data
    let total_cost =shares * purchasePrice;
    let equity_value =shares * currentPrice

    // formatted 
    let fPrice = currencyFormatter(currentPrice); // replace with API call
    let fPurchasePrice = currencyFormatter(purchasePrice)
    let fEquityValue = currencyFormatter(shares * currentPrice)
    let fTotalReturn = currencyFormatter(equity_value - total_cost)
    let fShares = Number(shares).toFixed(2)
    
    equityObj[`${symbol}`] = equity_value
   
    return (
            <tr className='holding-row'>
                <td className=""><a href={`/stocks/${symbol}`}>{symbol}</a></td>
                <td className="">{fShares}</td>
                <td className="">{fPrice}</td>
                <td className="">{fPurchasePrice}</td>
                <td className="">{fTotalReturn}</td>
                <td className="">{fEquityValue}</td>
            </tr>
    )
}

export default AssetHolding;