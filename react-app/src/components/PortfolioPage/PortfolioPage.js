import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PortfolioContent from './PortfolioContent'
import { loadPortfolio } from '../../store/portfolio'
import { loadTrades } from '../../store/trade'

const PortfolioPage = () => {
    const dispatch = useDispatch()
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
    }, [dispatch, userId, portfolioId])

    return (
        <div className='portfolio-page-container'>
            <div className="portfolio-content flex-container">
                <PortfolioContent user={user} cashBalance={cashBalance} trades={trades}/>
            </div>
            <div className="portfolio-watchlist flex-container">
                <h2>Watchlist</h2>
            </div>
        </div>
    )
}

export default PortfolioPage;