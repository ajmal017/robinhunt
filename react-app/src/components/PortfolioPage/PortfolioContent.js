import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPortfolio } from '../../store/portfolio'

const PortfolioContent = ({ user }) => {
    // const dispatch = useDispatch();
    // const portfolio = useSelector(state => state.portfolio.portfolio)
    
    let userId;
    user ? userId = user.id : userId = ""

    // useEffect(() => {
    //     dispatch(addPortfolio(userId))
    // }, [dispatch])

    return (
        <div className='portfolio-content-container'>
            <div className="chart-container">
                <h2>Portfolio Chart</h2>
            </div>
            <div className="holdings-container">
                <h2>Portfolio Holdings</h2>
            </div>
            <div className="news-container">
                <h2>Market News</h2>
            </div>
        </div>
    )
}

export default PortfolioContent;