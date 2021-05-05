import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PortfolioContent from './PortfolioContent'
import { loadPortfolio } from '../../store/portfolio'
import { loadTrades } from '../../store/trade'

const PortfolioPage = () => {
    const dispatch = useDispatch()
    const [news, setNews] = useState([])
    const user = useSelector(state => state.session.user)
    const user_portfolio = useSelector(state => state.portfolio.portfolio)
    const trades = useSelector(state => state.trade.trades)

    let userId;
    let cashBalance;
    let portfolioId;
    user ? userId = user.id : userId = ""
    user_portfolio ? cashBalance = user_portfolio.cash_balance : cashBalance = 0
    user_portfolio ? portfolioId = user_portfolio.id : cashBalance = ""

    
    useEffect(() => {
        if(userId) dispatch(loadPortfolio(userId))
        if(portfolioId) dispatch(loadTrades(portfolioId))

        fetch('https://finnhub.io/api/v1/news?category=general&token=c27ut2aad3ic393ffql0', { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }
                console.log(body.url);
                console.log(body.explanation);
            })
            .then(res => res.json())
            .then(data => {
                let lastNews = data.slice(0, 5) // get first 5 results back only
                setNews(lastNews)
            });
            
    }, [dispatch, userId, portfolioId])

    return (
        <div className='portfolio-page-container'>
            <div className="portfolio-content flex-container">
                <PortfolioContent user={user} cashBalance={cashBalance} trades={trades} news={news}/>
            </div>
            <div className="portfolio-watchlist flex-container">
                <h2>Watchlist</h2>
            </div>
        </div>
    )
}

export default PortfolioPage;