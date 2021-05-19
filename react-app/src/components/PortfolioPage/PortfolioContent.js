import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTrades } from '../../store/trade'
import AssetHolding from './AssetHolding'
import NewsCard from '../NewsCard'
import PortfolioChart from './PortfolioChart'

const PortfolioContent = ({ user, cashBalance, trades, holdings, news, refreshCount, setRefreshCount, prices }) => {
    const bolt = require('../../front-assets/bolt.png')
    const [holdingValue, setHoldingValue] = useState(0)
    const [portValue, setPortValue] = useState(0)
    const [capInvested, setCapInvested] = useState(0)
    const [totalReturn, setTotalReturn] = useState(0)
    const [returnPercent, setReturnPercent] = useState(0)
    const [equityValues, setEquityValues] = useState([])
    const [newsButtonText, setNewsButtonText] = useState('Show newer articles')
    const getPortfolioValue = (holdValue) => holdValue + cashBalance;    
    const currencyFormatter = (num) => Number(num).toFixed(2)

    const [latestArticle, setLatestArticle] = useState(null)
    const [articles, setArticles] = useState(null)

    let equityObj = {};
    const getHoldingValue = () => {
        let total = 0
        for (let key in equityObj){
            let value = equityObj[key];
            total += value;
        }
        return total
    }

    const getEquityValues = () => {
        let myEquity = [];
        for (let key in equityObj){
            let holding = {'ticker':key, 'equityValue': Number(equityObj[key]).toFixed(2)}
            myEquity.push(holding)
        }
        return myEquity
    }

    let capitalInvested, fCapInvested, myReturn;
    if(holdings) capitalInvested = holdings.reduce((sum, holding) => sum += (holding.cost*holding.volume), 0)
    if(capitalInvested) fCapInvested = currencyFormatter(capitalInvested)
    if(fCapInvested && capInvested === 0) setCapInvested(fCapInvested)
    
    useEffect(() => {
        let holdValue = getHoldingValue()
        let fHoldValue = currencyFormatter(holdValue)
        setHoldingValue(fHoldValue)

        let portfolioValue = getPortfolioValue(holdValue)
        let fPortValue = currencyFormatter(portfolioValue)
        setPortValue(fPortValue)

        if (holdingValue > 0 && capInvested > 0) {
            let myReturn = currencyFormatter(holdingValue - capInvested)
            setTotalReturn(myReturn)
            let percentage = Number((myReturn / capInvested)*100).toFixed(2);
            setReturnPercent(percentage)
        }
    }, [equityObj, myReturn])

    useEffect(() => {
        let myEquity = getEquityValues()
        setEquityValues(myEquity)
    }, [holdingValue])

    useEffect(() => {
        let lastNews = news[0];
        let otherArticles = news.slice(1)
        setLatestArticle(lastNews)
        setArticles(otherArticles)
    }, [news])

    const chartDisplay = (
        <div className='flex-container'>
            <PortfolioChart values={equityValues} />
        </div>
    )

    const updateNews = () => {
        setRefreshCount(refreshCount+1)
        setNewsButtonText(`All set! You're up to date`)
        setTimeout(() => {
            setNewsButtonText('Show newer articles')
        }, [10000])
    }
    
    return (
        <div className='portfolio-content-container'>
            <div className="chart-container">
                <div className='portfolio-summary'>
                    <h3 style={{ 'paddingBottom': '20px', 'fontSize':'18px' }} className="indent-heading min-margin">Portfolio Value: ${portValue}</h3>
                    
                    <div className='portfolio-item-div'>
                        <p className="portfolio-summary-item">Cash Balance:</p>
                        <p className="portfolio-summary-item">${Number(cashBalance).toFixed(2)}</p>
                    </div>
                    <div className='portfolio-item-div grey-underline'>
                        <p className="portfolio-summary-item">Est. Holdings Value: </p>
                        <p className="portfolio-summary-item">${holdingValue}</p>
                    </div>
                    
                    <div className='portfolio-item-div grey-underline'>
                        <p className="portfolio-summary-item">Capital Invested: </p>
                        <p className="portfolio-summary-item">${capInvested}</p>
                    </div>
    
                    <div className='portfolio-item-div'>
                        <h4 style={{'fontSize': '15px'}} className="portfolio-summary-item">Net Holdings Value: </h4>
                        <h4 style={{ 'fontSize': '15px' }} className="portfolio-summary-item">${totalReturn}</h4>
                    </div>
                </div>
                {chartDisplay}
            </div>
            <div className="holdings-container">
                <h2 className="">Holdings</h2>
                <table className="holding-table">
                    <thead>
                        <tr className="holding-table-labels">
                            <td>Symbol</td>
                            <td>Shares</td>
                            <td>Price</td>
                            <td>Avg Cost</td>
                            <td>Equity Value</td>
                            <td>Net Value</td>
                        </tr>
                    </thead>
                    <tbody>
                        {holdings && prices && prices.length > 0 && holdings.map((holding, idx) => {
                            let price = prices[idx].c
                            return <AssetHolding key={holding.ticker} symbol={holding.ticker} shares={holding.volume} currentPrice={price} purchasePrice={holding.cost} equityObj={equityObj} currencyFormatter={currencyFormatter} />
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="news-container">
                <h2 className="">News</h2>
                <div className='flex-container line-above'>
                    <p onClick={updateNews} className='fetch-news-button'> {newsButtonText}</p>
                </div>
                {latestArticle && 
                (<a href={latestArticle.url} target="_blank">
                    <div className="news-header-container">
                        <div className='news-info-container'>
                            <p className='news-source boldest'>
                                <img style={{ 'width': '10px', 'marginRight': '8px' }} src={bolt}></img>{latestArticle.source}
                            </p>
                            <div className="news-header-title boldest">
                                <p>{latestArticle.headline}</p>
                            </div>
                            <div className="news-header-summary">
                                <p>{latestArticle.summary}</p>
                            </div>
                            <div style={{ 'paddingBottom': '20px' }} className='news-source boldest capitalize'>
                                {latestArticle.category}
                            </div>
                        </div>
                        <div className='news-header-image-container'>
                            <img className="news-header-image" src={latestArticle.image}></img>
                        </div>
                    </div>
                </a>)
                }
                {articles && articles.map(article => (
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