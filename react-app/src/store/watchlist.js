// USER PORTFOLIO STATE

// Constants --------------------
const SET_WATCHLISTS = 'watchlist/SET_WATCHLISTS';
const SET_WATCHLIST_ITEMS = 'watchlist/SET_WATCHLIST_ITEMS';
const ADD_NEW_WATCHLIST = 'watchlist/ADD_NEW_WATCHLIST';
const ADD_NEW_WATCHLIST_ITEM = 'watchlist/ADD_NEW_WATCHLIST_ITEM';
const REMOVE_WATCHLIST_ITEM = 'watchlist/REMOVE_WATCHLIST_ITEM';
// const REMOVE_TRADES = 'trade/REMOVE_TRADES';



// Action Creators --------------------
const setWatchlists = watchlists => ({ type: SET_WATCHLISTS, payload: watchlists })
const setWatchlistItems = watchlist_items => ({ type: SET_WATCHLIST_ITEMS, payload: watchlist_items })

const addNewWatchlist = watchlist => ({ type: ADD_NEW_WATCHLIST, payload: watchlist})
const addNewWatchlistItem = watchlist_item => ({ type: ADD_NEW_WATCHLIST_ITEM, payload: watchlist_item })
const removeWatchlistItem = watchlist_item => ({ type: REMOVE_WATCHLIST_ITEM, payload: watchlist_item })

// const removeTrades = () => ({ type: REMOVE_TRADES })



// Thunks --------------------

export const loadWatchlists = (userId) => async (dispatch) => {
    // console.log('WE IN THA THUNK', userId)
    const response = await fetch(`/api/watchlists/${userId}`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    if (data.errors) return;
    let watchlists = data.watchlists
    dispatch(setWatchlists(watchlists))
}

export const loadWatchlistItems = (watchlistId) => async (dispatch) => {
    // console.log('WE IN THA THUNK: WATCH', watchlistId)
    const response = await fetch(`/api/watchlists/${watchlistId}/items`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json();
    // console.log(data)
    if (data.errors) return;
    let watchlist_items = data.watchlist_items
    dispatch(setWatchlistItems(watchlist_items))
}


// POST

export const addWatchlist = (name, user_id) => async (dispatch) => {
    // console.log('WE IN THA THUNK: WL', name, user_id)
    const response = await fetch(`/api/watchlists/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, user_id })
    })
    const watchlist = await response.json();
    if (watchlist.errors) return;
    dispatch(addNewWatchlist(watchlist))
}

export const addWatchlistItem = (watchlist_id, ticker) => async (dispatch) => {
    // console.log('WE IN THA THUNK: ADD WL', watchlist_id, ticker)
    const response = await fetch(`/api/watchlists/${watchlist_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
    })
    const watchlist_item = await response.json();
    if (watchlist_item.errors) return;
    dispatch(addNewWatchlistItem(watchlist_item))
}

// DELETE 

export const deleteWatchlistItem = (watchlist_id, ticker) => async (dispatch) => {
    console.log('WE IN THA THUNK: RM WL', watchlist_id, ticker)
    const response = await fetch(`/api/watchlists/${watchlist_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
    })
    const watchlist_item = await response.json();
    console.log(watchlist_item)
    if (watchlist_item.errors) return;
    dispatch(removeWatchlistItem(watchlist_item))
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

        case ADD_NEW_WATCHLIST:
            const allWatchlists = [...state.watchlists]; // save new copy of existing WLs
            allWatchlists.push(action.payload) // add newly created to copied array
            return { ...state, watchlists: allWatchlists}; // replace existing list with new list
        
        case ADD_NEW_WATCHLIST_ITEM:
            let allWatchlistItems = [...state.watchlist_items]; // save new copy of existing WLs
            allWatchlistItems.push(action.payload) // add newly created to copied array
            return { ...state, watchlist_items: allWatchlistItems }; // replace existing list with new list
        
        // case REMOVE_WATCHLIST_ITEM:
        //     let allWatchlistItems = [...state.watchlist_items]; // save new copy of existing WLs
        //     allWatchlistItems[action.payload] // add newly created to copied array
        //     return { ...state, trades: null };
        
        default:
            return state;
    }
}