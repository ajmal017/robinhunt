// USER PORTFOLIO STATE

// Constants --------------------
const SET_PORTFOLIO = 'portfolio/SET_PORTFOLIO';
// const REMOVE_PORTFOLIO = 'portfolio/REMOVE_PORTFOLIO';



// Action Creators --------------------
const setPortfolio = portfolio => ({ type: SET_PORTFOLIO, payload: portfolio })
// const removePortfolio = () => ({ type: REMOVE_PORTFOLIO })



// Thunks --------------------
// Add user portfolio object to state
export const loadPortfolio = (userId) => async (dispatch) => {
    const response = await fetch(`/api/portfolios/${userId}`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    if (data.errors) return;
    dispatch(setPortfolio(data))
}


// Remove user portfolio object from state
// export const deletePortfolio = () => async (dispatch) => {
//     const response = await fetch('/api/portfolio/', {
//         headers: { 'Content-Type': 'application/json' },
//     })

//     const data = await response.json(); // wait until finished removing on backend 
//     dispatch(removePortfolio()) // then remove from state
// }



// User Authentication Reducer --------------------
const initialState = { portfolio: null };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_PORTFOLIO:
            return { ...state, portfolio: action.payload };
        // case REMOVE_PORTFOLIO:
        //     return { ...state, portfolio: null };
        default:
            return state;
    }
}