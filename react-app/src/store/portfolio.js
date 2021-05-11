// USER PORTFOLIO STATE

// Constants --------------------
const SET_PORTFOLIO = 'portfolio/SET_PORTFOLIO';

// const UPDATE_CASH_BALANCE = 'portfolio/UPDATE_CASH_BALANCE';


// Action Creators --------------------
const setPortfolio = portfolio => ({ type: SET_PORTFOLIO, payload: portfolio })

// const updateCashBalance = balance => ({ type: UPDATE_CASH_BALANCE, payload: balance })


// Thunks --------------------

// GET
// Add user portfolio object to state
export const loadPortfolio = (userId) => async (dispatch) => {
    const response = await fetch(`/api/portfolios/${userId}`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    if (data.errors) return;
    dispatch(setPortfolio(data))
}


// PATCH
// Update cash balance on user's portfolio
export const updateBalance = (portfolio_id, adjustment) => async (dispatch) => {
    console.log('patch balance', portfolio_id, adjustment)
    const response = await fetch(`/api/portfolios/${portfolio_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustment })
    })
    const portfolio = await response.json();
    if (portfolio.errors) return;
    dispatch(setPortfolio(portfolio))
}



// Portfolio Reducer --------------------
const initialState = { portfolio: null, holdings: null };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_PORTFOLIO:
            return { ...state, portfolio: action.payload };
        
        // case UPDATE_CASH_BALANCE:
        //     let newPortfolio = state.portfolio;
        //     newPortfolio.cash_balance = action.payload
        //     return { ...state, portfolio: newPortfolio };
        default:
            return state;
    }
}