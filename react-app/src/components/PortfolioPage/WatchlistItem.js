import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

const AssetHolding = ({ stock, price }) => {

    // get watchlist items on page load, pass here

    return (
        <div className='watchlist-item'>
            <div>
                <p><a href={`/stocks/${stock}`}>{stock}</a></p>
            </div>
            <div>
                <p>{price}</p>
            </div>
        </div>
    )
}

export default AssetHolding;