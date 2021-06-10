// PORTFOLIO STATE

// Constants --------------------
const SET_PORTFOLIO = 'portfolio/SET_PORTFOLIO';

// Action Creators --------------------
const setPortfolio = portfolio => ({ type: SET_PORTFOLIO, payload: portfolio })

// Thunks --------------------

// GET
// Add user portfolio object to state
export const loadPortfolio = (user_id) => async (dispatch) => {
    const response = await fetch(`/api/users/${user_id}/portfolios`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    if (data.errors) return;
    dispatch(setPortfolio(data))
}


// PATCH
// Update cash balance on user's portfolio
export const updateBalance = (user_id, portfolio_id, adjustment) => async (dispatch) => {
    console.log('patch balance', user_id, portfolio_id, adjustment)
    const response = await fetch(`/api/users/${user_id}/portfolios/${portfolio_id}`, {
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
        default:
            return state;
    }
}