// USER PORTFOLIO STATE

// Constants --------------------
const SET_TRADES = 'trade/SET_TRADES';
const ADD_TRADE = 'trade/ADD_TRADE';
// const REMOVE_TRADES = 'trade/REMOVE_TRADES';



// Action Creators --------------------
const setTrades = trades => ({ type: SET_TRADES, payload: trades })
const addTrade = trade => ({ type: ADD_TRADE, payload: trade })
// const removeTrades = () => ({ type: REMOVE_TRADES })



// Thunks --------------------

// GET
// Add user trades in user portfolio to redux state
export const loadTrades = (portfolioId) => async (dispatch) => {
    // console.log('WE IN THA THUNK', portfolioId)
    const response = await fetch(`/api/trades/${portfolioId}`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    // console.log(data)
    if (data.errors) return;
    let trades = data.trades
    dispatch(setTrades(trades))
}

// POST
export const submitTrade = (portfolio_id, order_type, ticker, order_price, order_volume) => async (dispatch) => {
    console.log(portfolio_id, order_type, ticker, order_price, order_volume)
    let numPrice = parseFloat(order_price).toFixed(2)
    let numVolume = parseFloat(order_volume).toFixed(2)
    
    console.log(portfolio_id, order_type, ticker, numPrice, numVolume)
    const response = await fetch(`/api/trades/${portfolio_id}/stocks/${ticker}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolio_id, order_type, ticker, 'order_price':numPrice, 'order_volume':numVolume })
    })
    const trade = await response.json();
    if (trade.errors) return;
    dispatch(addTrade(trade))
}



// User Authentication Reducer --------------------
const initialState = { trades: null };

export default function reducer(state = initialState, action) {
    let allTrades;
    switch (action.type) {
        case SET_TRADES:
            return { ...state, trades: action.payload };
        case ADD_TRADE:
            allTrades = [...state.trades] 
            allTrades.push(action.payload)
            return { ...state, trades: allTrades };
        default:
            return state;
    }
}