import React from "react";

const AssetHolding = ({ symbol, shares, purchasePrice, currentPrice, equityObj, currencyFormatter }) => {
    //raw data
    let total_cost =shares * purchasePrice;
    let equity_value =shares * currentPrice
    equityObj[`${symbol}`] = equity_value

    // formatted 
    let fPrice = currencyFormatter(currentPrice);
    let fPurchasePrice = currencyFormatter(purchasePrice)
    let fEquityValue = currencyFormatter(shares * currentPrice)
    let fTotalReturn = currencyFormatter(equity_value - total_cost)
    let fShares = Number(shares).toFixed(2)
    
   
    return (
            <tr className='holding-row'>
                <td className=""><a href={`/stocks/${symbol}`}>{symbol}</a></td>
                <td className="">{fShares}</td>
                <td className="">{fPrice}</td>
                <td className="">{fPurchasePrice}</td>
                <td className="">{fEquityValue}</td>
                <td className="">{fTotalReturn}</td>
            </tr>
    )
}

export default AssetHolding;