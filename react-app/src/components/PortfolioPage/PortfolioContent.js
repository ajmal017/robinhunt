import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTrades } from '../../store/trade'
import AssetHolding from './AssetHolding'
import NewsCard from '../NewsCard'

const PortfolioContent = ({ user, cashBalance, trades, news }) => {    
    const [portValue, setPortValue] = useState(0)
    const currencyFormatter = (num) => Number(num).toFixed(2)

    let equityObj = {}
    const getPortfolioValue = () => {
        let total = 0;
        for (let key in equityObj) {
            let value = equityObj[key]
            total += value;
        }
        return total
    }

    useEffect(() => {
        let newValue = getPortfolioValue()
        let fNewValue = currencyFormatter(newValue)
        setPortValue(fNewValue)
    }, [equityObj])

    return (
        <div className='portfolio-content-container'>
            <div className="chart-container">
                <div className='flex-container'>
                    <h3 className="indent-heading min-margin">Porfolio: ${portValue}</h3>
                    <h3 className="indent-heading min-margin">Cash: ${cashBalance}</h3>
                </div>
                <div className="flex-container"> DISPLAY CHART HERE</div>
            </div>
            <div className="holdings-container">
                <h2 className="indent-heading">Portfolio Holdings</h2>
                <table className="holding-table">
                    <thead>
                        <tr className="holding-row holding-table-labels">
                            <td>Symbol</td>
                            <td>Shares</td>
                            <td>Price</td>
                            <td>Avg Cost</td>
                            <td>Total Return</td>
                            <td>Equity Value</td>
                        </tr>
                    </thead>
                    <tbody>
                        {trades && trades.map(trade => (
                            <AssetHolding key={trade.id} symbol={trade.ticker} shares={trade.order_volume} purchasePrice={trade.order_price} equityObj={equityObj} currencyFormatter={currencyFormatter} />
                        ))}
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