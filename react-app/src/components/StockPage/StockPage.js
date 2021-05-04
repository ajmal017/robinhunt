import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router';

const StockPage = () => {
    const { ticker } = useParams()
    return (
        <h1>Stock Page - {ticker}</h1>
    )
}

export default StockPage;