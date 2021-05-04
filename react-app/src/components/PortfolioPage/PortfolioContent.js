import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

const PortfolioContent = () => {
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