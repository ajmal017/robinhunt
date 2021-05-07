import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

const OrderForm = ({ stock, price }) => {

    const [amount, setAmount] = useState(50)

    let quantity
    if (price && amount !== 0) quantity = amount / price

    return (
        <div>
            <div>
                <h4 className='order-header'>Buy {stock}</h4>
            </div>
            <div>
                <form>
                    <div style={{ 'borderBottom': '1px solid lightgrey' }} className='order-input'>
                        <label> Amount ($) </label>
                        <input type="number" name='amount' value={amount} onChange={(e) => setAmount(e.target.value)}></input>
                    </div>
                    <div className='order-input'>
                        <p style={{ 'fontWeight': 'bold' }}> Est. Quantity</p>
                        <p style={{ 'paddingLeft': '80px' }}> {quantity && quantity.toFixed(6)} </p>
                    </div>
                    <div className='order-button flex-container'>
                        <button type="submit"> Review Order</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OrderForm;