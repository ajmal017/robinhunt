import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTrades } from '../../store/trade'
import AssetHolding from './AssetHolding'
import NewsCard from '../NewsCard'
import PortfolioChart from './PortfolioChart'

const PortfolioContent = ({ user, cashBalance, trades, news, prices }) => {    
    const [holdingValue, setHoldingValue] = useState(0)
    const [portValue, setPortValue] = useState(0)
    const [capInvested, setCapInvested] = useState(0)
    const [totalReturn, setTotalReturn] = useState(0)
    const getPortfolioValue = (holdValue) => holdValue + cashBalance;    
    const currencyFormatter = (num) => Number(num).toFixed(2)

    let equityObj = {};
    const getHoldingValue = () => {
        let total = 0
        for (let key in equityObj){
            let value = equityObj[key];
            total += value;
        }
        return total
    }
    let capitalInvested;
    let fCapInvested;
    let myReturn;
    if(trades) capitalInvested = trades.reduce((sum, trade) => sum += (trade.order_price*trade.order_volume), 0)
    if(capitalInvested) fCapInvested = currencyFormatter(capitalInvested)
    if(fCapInvested && capInvested === 0) setCapInvested(fCapInvested)
    
    useEffect(() => {
        let holdValue = getHoldingValue()
        let fHoldValue = currencyFormatter(holdValue)
        setHoldingValue(fHoldValue)

        let portfolioValue = getPortfolioValue(holdValue)
        let fPortValue = currencyFormatter(portfolioValue)
        setPortValue(fPortValue)

        if (portValue > 0 && capInvested > 0) {
            myReturn = currencyFormatter(portValue - capInvested)
            setTotalReturn(myReturn)
        }
    }, [equityObj, myReturn])

    const chartDisplay = (
        <div className='flex-container'>
            <PortfolioChart trades={trades} />
        </div>
    )
    
    return (
        <div className='portfolio-content-container'>
            <div className="chart-container">
                <div className='portfolio-summary'>
                    <h3 style={{ 'paddingBottom': '10px' }} className="indent-heading min-margin">Portfolio Value: ${portValue}</h3>
                    <p className="portfolio-summary-item">Cash Balance: ${cashBalance}</p>
                    <p className="portfolio-summary-item">Est. Holdings Value: ${holdingValue}</p>
                    <div style={{'paddingBottom':'10px'}} className="portfolio-summary-item">_______________________________</div>
                    <p className="portfolio-summary-item">Current Value: ${portValue}</p>
                    <p className="portfolio-summary-item">Capital Invested: ${capInvested}</p>
                    <div style={{ 'paddingBottom': '10px' }} className="portfolio-summary-item">_______________________________</div>
                    <h4 className="portfolio-summary-item">Total Return: ${totalReturn}</h4>
                </div>
                {chartDisplay}
            </div>
            <div className="holdings-container">
                <h2 className="indent-heading">Holdings</h2>
                <table className="holding-table">
                    <thead>
                        <tr className="holding-table-labels">
                            <td>Symbol</td>
                            <td>Shares</td>
                            <td>Price</td>
                            <td>Avg Cost</td>
                            <td>Total Return</td>
                            <td>Equity Value</td>
                        </tr>
                    </thead>
                    <tbody>
                        {trades && prices && trades.map((trade, idx) => {
                            let price = prices[idx].c
                            return <AssetHolding key={trade.id} symbol={trade.ticker} shares={trade.order_volume} currentPrice={price} purchasePrice={trade.order_price} equityObj={equityObj} currencyFormatter={currencyFormatter} />
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="news-container">
                <h2 className="indent-heading">News</h2>
                {news && news.map(article => (
                    <NewsCard key={article.id} article={article} />
                ))}
            </div>
        </div>
    )
}

export default PortfolioContent;


// FINNHUB API: SAMPLE NEWS OBJ RESPONSE
// {
//     "category": "technology",
//         "datetime": 1596589501,
//             "headline": "Square surges after reporting 64% jump in revenue, more customers using Cash App",
//                 "id": 5085164,
//                     "image": "https://image.cnbcfm.com/api/v1/image/105569283-1542050972462rts25mct.jpg?v=1542051069",
//                         "related": "",
//                             "source": "CNBC",
//                                 "summary": "Shares of Square soared on Tuesday evening after posting better-than-expected quarterly results and strong growth in its consumer payments app.",
//                                     "url": "https://www.cnbc.com/2020/08/04/square-sq-earnings-q2-2020.html"
// },