import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PortfolioContent from './PortfolioContent'
import { addPortfolio } from '../../store/portfolio'

const PortfolioPage = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const user_portfolio = useSelector(state => state.portfolio.portfolio)

    let userId;
    user ? userId = user.id : userId = ""

    let cashBalance;
    user_portfolio ? cashBalance=user_portfolio.cash_balance : cashBalance=0
    
    useEffect(() => {
        dispatch(addPortfolio(userId))
    }, [dispatch])

    return (
        <div className='portfolio-page-container'>
            <div className="portfolio-content flex-container">
                <PortfolioContent user={user} cashBalance={cashBalance}/>
            </div>
            <div className="portfolio-watchlist flex-container">
                <h2>Watchlist</h2>
            </div>
        </div>
    )
}

export default PortfolioPage;