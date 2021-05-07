import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PortfolioContent from './PortfolioContent'
import { loadPortfolio } from '../../store/portfolio'
import { loadTrades } from '../../store/trade'
import Watchlist from './Watchlist';

const PortfolioPage = () => {
    const dispatch = useDispatch()
    const [news, setNews] = useState([])
    const [prices, setPrices] = useState(null)

    const user = useSelector(state => state.session.user)
    const user_portfolio = useSelector(state => state.portfolio.portfolio)
    const trades = useSelector(state => state.trade.trades)

    let userId, cashBalance, portfolioId;
    user ? userId = user.id : userId = ""
    user_portfolio ? cashBalance = user_portfolio.cash_balance : cashBalance = 0
    user_portfolio ? portfolioId = user_portfolio.id : cashBalance = ""

    const getNews = async() => {
        const response = await fetch('https://finnhub.io/api/v1/news?category=general&token=c27ut2aad3ic393ffql0', { json: true })
        if(response.ok) {
            let data = await response.json()
            let lastNews = data.slice(0, 5) // get first 5 results back only
            setNews(lastNews)
        }
    }

    const getPrice = async(ticker) => {
        let res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c27ut2aad3ic393ffql0`, { json: true })
        return res.json() // returns promise for loadPrices function
    }    

    const loadPrices = async() => {
        if(trades) {
            let allPrices = trades.map(trade => getPrice(trade.ticker)) // returns array of promises
            let priceData = await Promise.all(allPrices) // returns array of objects
            setPrices(priceData)
        }
    }

    useEffect(() => {
        if (portfolioId) dispatch(loadTrades(portfolioId))
    }, [portfolioId])
    
    useEffect(() => {
        if(userId) dispatch(loadPortfolio(userId))
        getNews()
        loadPrices()
    }, [dispatch, trades, userId, portfolioId])

    return (
        <div className='portfolio-page-container'>
            <div className="portfolio-content flex-container">
                <PortfolioContent user={user} cashBalance={cashBalance} trades={trades} news={news} prices={prices}/>
            </div>
            <div className="portfolio-watchlist">
                <div className='watchlist-container'>
                    <Watchlist />
                </div>
            </div>
        </div>
    )
}

export default PortfolioPage;