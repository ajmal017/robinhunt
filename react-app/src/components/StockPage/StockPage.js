import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router';

const StockPage = () => {
    const { ticker } = useParams()
    return (
        <div className='stock-page-container'>
            <div className="stock-chart flex-container">
                <h2>Stock Chart - #{ticker}</h2>
            </div>
            <div className="stock-info flex-container">
                <h2>Stock Info</h2>
            </div>
            <div className="stock-order flex-container">
                <h2>Order Form</h2>
            </div>
        </div>
    )
}

export default StockPage;