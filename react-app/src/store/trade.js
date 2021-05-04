// USER PORTFOLIO STATE

// Constants --------------------
const SET_TRADES = 'trade/SET_TRADES';
// const REMOVE_TRADES = 'trade/REMOVE_TRADES';



// Action Creators --------------------
const setTrades = trades => ({ type: SET_TRADES, payload: trades })
// const removeTrades = () => ({ type: REMOVE_TRADES })



// Thunks --------------------
// Add user trades in user portfolio to redux state
export const loadTrades = (portfolioId) => async (dispatch) => {
    console.log('WE IN THA THUNK', portfolioId)
    const response = await fetch(`/api/trades/${portfolioId}`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    // console.log(data)
    if (data.errors) return;
    dispatch(setTrades(data.trades))
}


// // Remove user portfolio object from state
// export const deleteTrades = () => async (dispatch) => {
//     const response = await fetch('/api/trades/', {
//         headers: { 'Content-Type': 'application/json' },
//     })

//     const data = await response.json(); // wait until finished removing on backend 
//     dispatch(removeTrades()) // then remove from state
// }



// User Authentication Reducer --------------------
const initialState = { trades: null };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TRADES:
            return { ...state, trades: action.payload };
        // case REMOVE_TRADES:
        //     return { ...state, trades: null };
        default:
            return state;
    }
}