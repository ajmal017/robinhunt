import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { submitTrade } from '../../store/trade'

const OrderForm = ({ stock, price, cashBalance }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const [amount, setAmount] = useState(50)
    const [orderType, setOrderType] = useState('buy')
    const [showConfirmation, setShowConfirmation] = useState(false)

    let quantity, confirmation, displayConfirm, displayReview, buttonText;
    if (price && amount !== 0) quantity = amount / price

    if(quantity) {
        confirmation = (
        <>
            <h4 className='min-margin'>Confirmation Notice:</h4>
            <div>I hereby confirm intent to purchase ~{Number(quantity).toFixed(2)} shares of {stock}. I acknowledge order price may be subject to change depending on market conditions as order is executed.</div>
        </>
    )}

    if(showConfirmation) {
        displayConfirm = '';
        displayReview = 'none';
    } else {
        displayConfirm = 'none';
        displayReview = '';
    }

    const revealSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    }

    const cancelSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(false);
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let portfolio_id = 1;
        let order_type = orderType;
        let ticker = stock;
        let order_price = Number(price).toFixed(2)
        let order_volume = Number(quantity).toFixed(2)
        dispatch(submitTrade(portfolio_id, order_type, ticker, order_price, order_volume))
        // alert('trade complete!')
        // history.push('/')
        // setShowConfirmation(false);
    }

    return (
        <div>
            <div>
                <h4 className='order-header'>Trade {stock}</h4>
            </div>
            <div>
                <form onSubmit={onSubmit}>
                    <div style={{ 'borderBottom': '1px solid lightgrey' }} className='order-input'>
                        <label> Order Type </label>
                        <select name='type' value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                            <option value='buy'>Buy</option>
                            <option value='sell'>Sell</option>
                        </select>
                    </div>
                    <div style={{ 'borderBottom': '1px solid lightgrey' }} className='order-input'>
                        <label> Amount ($) </label>
                        <input type="number" name='amount' value={amount} onChange={(e) => setAmount(e.target.value)}></input>
                    </div>
                    <div className='order-input'>
                        <p style={{ 'fontWeight': 'bold' }}> Est. Quantity</p>
                        <p style={{ 'paddingLeft': '80px' }}> {quantity && quantity.toFixed(6)} </p>
                    </div>
                    <div style={{'display':`${displayConfirm}`}} className='stock-order-confirm'>
                        {confirmation}
                    </div>
                    <div className='order-button flex-container'>
                        <button style={{ 'display': `${displayReview}` }} onClick={revealSubmit}> Review Order</button>
                        <div className='order-button flex-container-stack'>
                            <button style={{'display':`${displayConfirm}`}} type='submit'> Confirm</button>
                            <button style={{ 'display': `${displayConfirm}` }} onClick={cancelSubmit}> Cancel</button>
                        </div>
                    </div>
                    <div style={{ 'display': `${displayReview}` }} className='stock-order-balance'>  
                        <p> 
                        You have a cash balance of ${cashBalance} available for spending.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default OrderForm;