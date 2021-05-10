// USER PORTFOLIO STATE

// Constants --------------------
const SET_WATCHLISTS = 'watchlist/SET_WATCHLISTS';
const SET_WATCHLIST_ITEMS = 'watchlist/SET_WATCHLIST_ITEMS';
// const REMOVE_TRADES = 'trade/REMOVE_TRADES';



// Action Creators --------------------
const setWatchlists = watchlists => ({ type: SET_WATCHLISTS, payload: watchlists })

const setWatchlistItems = watchlist_items => ({ type: SET_WATCHLIST_ITEMS, payload: watchlist_items })

// const removeTrades = () => ({ type: REMOVE_TRADES })



// Thunks --------------------
// Add user trades in user portfolio to redux state
export const loadWatchlists = (userId) => async (dispatch) => {
    // console.log('WE IN THA THUNK', userId)
    const response = await fetch(`/api/watchlists/${userId}`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    // console.log(data)
    if (data.errors) return;
    let watchlists = data.watchlists
    dispatch(setWatchlists(watchlists))
}

export const loadWatchlistItems = (watchlistId) => async (dispatch) => {
    console.log('WE IN THA THUNK: WATCH', watchlistId)
    const response = await fetch(`/api/watchlists/${watchlistId}/items`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    console.log(data)
    if (data.errors) return;
    let watchlist_items = data.watchlist_items
    dispatch(setWatchlistItems(watchlist_items))
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
const initialState = { watchlists: null, watchlist_items: null };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_WATCHLISTS:
            return { ...state, watchlists: action.payload };
        case SET_WATCHLIST_ITEMS:
            return { ...state, watchlist_items: action.payload };
        // case REMOVE_TRADES:
        //     return { ...state, trades: null };
        default:
            return state;
    }
}