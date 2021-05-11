import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { submitTrade } from '../../store/trade';
import { updateBalance } from '../../store/portfolio';


const OrderForm = ({ stock, price, cashBalance, portfolioId, holdings }) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [holdingQty, setHoldingQty] = useState(0)
    const [orderType, setOrderType] = useState('buy')
    const [showConfirmation, setShowConfirmation] = useState(false)
    
    // BUY FIELDS
    const [amount, setAmount] = useState(0)
    const [buyOrderQty, setBuyOrderQty] = useState(0)
    
    // SELL FIELDS
    const [sellOrderQty, setSellOrderQty] = useState(0)
    const [returnValue, setReturnValue] = useState(0)
        
    useEffect(() => {
        let stockHolding = holdings.find(holding => holding.ticker === stock)
        if(stockHolding) {
            setHoldingQty(stockHolding.volume);
            setSellOrderQty(stockHolding.volume)
        }
    }, [holdings])

    useEffect(() => {
        setBuyOrderQty(amount / price)
        setReturnValue(sellOrderQty * price)
        // if(orderType === 'sell') setAmount(returnValue)
    }, [price])

    // let quantity, displayConfirm, displayReview, buttonText, returnValue;
    // if (price && amount !== 0) quantity = amount / price
    // if (price && shares !== 0) returnValue = shares * price

    // if(quantity) {
    //     confirmation = (
    //     <>
    //         <h4 className='min-margin'>Confirmation Notice:</h4>
    //         <div>I hereby confirm intent to purchase ~{Number(buyOrderQty).toFixed(2)} shares of {stock}. I acknowledge order price may be subject to change depending on market conditions as order is executed.</div>
    //     </>
    // )}

    let displayReview, displayConfirm;
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

        let order_type = orderType;
        let ticker = stock;
        let order_price = Number(price).toFixed(2)

        let buy_order_volume = Number(buyOrderQty).toFixed(2)
        let sell_order_volume = Number(sellOrderQty).toFixed(2)
        
        let cashAdjustment;
        if(order_type === 'buy'){
            cashAdjustment = -1 * Number(amount).toFixed(2);
            if (cashBalance + cashAdjustment > 0){
                dispatch(submitTrade(portfolioId, order_type, ticker, order_price, buy_order_volume))
                dispatch(updateBalance(portfolioId, cashAdjustment))
            } else {
                alert('not enough cash available to complete purchase!')
            }
        } else {
            cashAdjustment = Number(returnValue).toFixed(2)
            console.log(sellOrderQty);
            console.log(holdingQty);
            if (sellOrderQty <= holdingQty){
                dispatch(submitTrade(portfolioId, order_type, ticker, order_price, sell_order_volume))
                dispatch(updateBalance(portfolioId, cashAdjustment))
            } else {
                alert('not enough share available to sell!')
            }
        }

        // dispatch(submitTrade(portfolioId, order_type, ticker, order_price, order_volume))
        // dispatch(updateBalance(portfolioId))
        // alert('trade complete!')
        // history.push('/')
        // setShowConfirmation(false);
    }

    let formFields; 
    if(orderType === 'buy') {
        formFields = (
            <>
                <div style={{ 'borderBottom': '1px solid lightgrey' }} className='order-input'>
                    <label> Amount ($) </label>
                    <input type="number" name='amount' value={amount} onChange={(e) => setAmount(e.target.value)}></input>
                </div>
                <div className='order-input'>
                    <p style={{ 'fontWeight': 'bold' }}> Est. Quantity</p>
                    <p style={{ 'paddingLeft': '80px' }}> {buyOrderQty && buyOrderQty.toFixed(6)} </p>
                </div>
                <div style={{ 'display': `${displayConfirm}` }} className='stock-order-confirm'>
                        <h4 className='min-margin'>Confirmation Notice:</h4>
                    <div>I hereby confirm intent to purchase ~{Number(buyOrderQty).toFixed(2)} shares of {stock}. I acknowledge order price may be subject to change depending on market conditions as order is executed.</div>
                </div>
                <div className='order-button flex-container'>
                    <button disabled={buyOrderQty === 0} style={{ 'display': `${displayReview}` }} onClick={revealSubmit}> Review Order</button>
                    <div className='order-button flex-container-stack'>
                        <button style={{ 'display': `${displayConfirm}` }} type='submit'> Confirm</button>
                        <button style={{ 'display': `${displayConfirm}` }} onClick={cancelSubmit}> Cancel</button>
                    </div>
                </div>
                <div style={{ 'display': `${displayReview}` }} className='stock-order-balance'>
                    <p>
                        You have a cash balance of ${Number(cashBalance).toFixed(2)} available for spending.
                        </p>
                </div>
            </>
            
        )
    } else {
        formFields = (
            <>
                <div style={{ 'borderBottom': '1px solid lightgrey' }} className='order-input'>
                    <label> Shares </label>
                    <input type="number" name='amount' value={sellOrderQty} onChange={(e) => setSellOrderQty(e.target.value)}></input>
                </div>
                <div className='order-input'>
                    <p style={{ 'fontWeight': 'bold' }}> Est. Value</p>
                    <p style={{ 'paddingLeft': '80px' }}> {returnValue && returnValue.toFixed(6)} </p>
                </div>
                <div style={{ 'display': `${displayConfirm}` }} className='stock-order-confirm'>
                    <h4 className='min-margin'>Confirmation Notice:</h4>
                    <div>I hereby confirm intent to sell ~{Number(sellOrderQty).toFixed(2)} shares of {stock}. I acknowledge sell order price may be subject to change depending on market conditions as order is executed.</div>
                </div>
                <div className='order-button flex-container'>
                    <button disabled={sellOrderQty === 0} style={{ 'display': `${displayReview}` }} onClick={revealSubmit}> Review Order</button>
                    <div className='order-button flex-container-stack'>
                        <button style={{ 'display': `${displayConfirm}` }} type='submit'> Confirm</button>
                        <button style={{ 'display': `${displayConfirm}` }} onClick={cancelSubmit}> Cancel</button>
                    </div>
                </div>
                <div style={{ 'display': `${displayReview}` }} className='stock-order-balance'>
                    <p>
                        You have {holdingQty} shares of {stock} available to sell.
                        </p>
                </div>
            </>

        )
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
                    { formFields }
                </form>
            </div>
        </div>
    )
}

export default OrderForm;