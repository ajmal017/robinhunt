import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FlipNumbers from 'react-flip-numbers';
import { submitTrade } from '../../store/trade';
import { updateBalance } from '../../store/portfolio';


const OrderForm = ({ stock, price, cashBalance, portfolioId, holdings }) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const gif = require('../../front-assets/order_confirm_animation.gif')

    const [holdingQty, setHoldingQty] = useState(0)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showGif, setShowGif] = useState(false)
    
    const [orderType, setOrderType] = useState('buy')
    const [orderValue, setOrderValue] = useState(0)
    const [orderVolume, setOrderVolume] = useState(1)

        
    useEffect(() => {
        let stockHolding = holdings.find(holding => holding.ticker === stock)
        if(stockHolding) {
            setHoldingQty(stockHolding.volume);
        }
    }, [holdings])

    useEffect(() => { setOrderValue(orderVolume * price) }, [price, orderVolume])

    let displayReview, displayConfirm, displayGif;
    if(showConfirmation) {
        displayConfirm = '';
        displayReview = 'none';
    } else {
        displayConfirm = 'none';
        displayReview = '';
    }
    
    if(showGif){
        displayGif = '';
    } else {
        displayGif = 'none';
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
        let order_volume = Number(orderVolume).toFixed(2)
        
        let cashAdjustment;
        if(order_type === 'buy'){
            cashAdjustment = -1 * Number(orderValue).toFixed(2);
            if (cashBalance + cashAdjustment > 0){
                dispatch(submitTrade(portfolioId, order_type, ticker, order_price, order_volume))
                dispatch(updateBalance(portfolioId, cashAdjustment))
                setShowConfirmation(false);
                setShowGif(true)
                setTimeout(() => history.push('/'), 3000)
            } else {
                alert(`Hold up! You don't have enough cash available to complete the purchase!`)
            }
        } else {
            cashAdjustment = Number(orderValue).toFixed(2)
            if (orderVolume <= holdingQty){
                dispatch(submitTrade(portfolioId, order_type, ticker, order_price, order_volume))
                dispatch(updateBalance(portfolioId, cashAdjustment))
                setShowConfirmation(false);
                setShowGif(true)
                setTimeout(() => history.push('/'), 3000)
            } else {
                alert(`Whoa there! You don't enough share available to sell!`)
            }
        }
    }

    let formFields; 
    if(orderType === 'buy') {
        formFields = (
            <>
                <div className='order-input'>
                    <p style={{ 'fontWeight': 'bold' }}> Est. Cost</p>
                    <p className='num-flip' style={{ 'paddingLeft': '60px' }}> {orderValue && 
                        <FlipNumbers height={15} width={10} color="var(--GREEN_TEXT)" background="white" play perspective={200} duration={1} numbers={`$${orderValue.toFixed(2)}`} />
                    } </p>
                </div>
                <div style={{ 'display': `${displayConfirm}` }} className='stock-order-confirm'>
                        <h4 className='min-margin'>Confirmation Notice:</h4>
                    <div>I hereby confirm intent to purchase ~{Number(orderVolume).toFixed(2)} shares of {stock}. I acknowledge order price may be subject to change depending on market conditions as order is executed.</div>
                </div>
                <div style={{ 'display': `${displayGif}` }} className='flex-container'>
                    <img style={{'width':'180px', 'marginBottom':'200px', 'marginTop':'30px'}} src={gif}></img>
                </div>
                <div className='order-button flex-container'>
                    <button disabled={orderVolume === 0 && orderValue === 0} style={{ 'display': `${displayReview}` }} onClick={revealSubmit}> Review Order</button>
                    <div className='order-button flex-container-stack'>
                        <button disabled={orderValue === 0} style={{ 'display': `${displayConfirm}` }} type='submit'> Confirm</button>
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
                <div className='order-input'>
                    <p style={{ 'fontWeight': 'bold' }}> Est. Value</p>
                    <p style={{ 'paddingLeft': '80px' }}> {orderValue && orderValue.toFixed(2)} </p>
                </div>
                <div style={{ 'display': `${displayConfirm}` }} className='stock-order-confirm'>
                    <h4 className='min-margin'>Confirmation Notice:</h4>
                    <div>I hereby confirm intent to sell ~{Number(orderVolume).toFixed(2)} shares of {stock}. I acknowledge sell order price may be subject to change depending on market conditions as order is executed.</div>
                </div>
                <div style={{ 'display': `${displayGif}` }} className='flex-container'>
                    <img style={{ 'width': '180px', 'marginBottom': '200px', 'marginTop': '30px' }} src={gif}></img>
                </div>
                <div className='order-button flex-container'>
                    <button disabled={orderVolume === 0 && orderValue === 0} style={{ 'display': `${displayReview}` }} onClick={revealSubmit}> Review Order</button>
                    <div className='order-button flex-container-stack'>
                        <button disabled={orderValue === 0} style={{ 'display': `${displayConfirm}` }} type='submit'> Confirm</button>
                        <button style={{ 'display': `${displayConfirm}` }} onClick={cancelSubmit}> Cancel</button>
                    </div>
                </div>
                <div style={{ 'display': `${displayReview}` }} className='stock-order-balance'>
                    <p>
                        You have {holdingQty.toFixed(2)} shares of {stock} available to sell.
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
                    <div style={{ 'borderBottom': '1px solid lightgrey' }} className='order-input'>
                        <label> Shares </label>
                        <input type="number" min='0' name='amount' value={orderVolume} onChange={(e) => setOrderVolume(e.target.value)}></input>
                    </div>
                    { formFields }
                </form>
            </div>
        </div>
    )
}

export default OrderForm;