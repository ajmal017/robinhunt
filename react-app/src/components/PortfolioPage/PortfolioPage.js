import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
import PortfolioContent from './PortfolioContent'

const PortfolioPage = () => {
    return (
        <div className='portfolio-page-container'>
            <div className="portfolio-content flex-container">
                <PortfolioContent />
            </div>
            <div className="portfolio-watchlist flex-container">
                <h2>Watchlist</h2>
            </div>
        </div>
    )
}

export default PortfolioPage;