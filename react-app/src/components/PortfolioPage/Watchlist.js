//REFACTOR FINISHED 

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadWatchlists, loadWatchlistItems, addWatchlist, deleteWatchlist } from '../../store/watchlist';
import WatchlistItem from './WatchlistItem';

const Watchlist = ({ userId }) => {
    const dispatch = useDispatch()
    const plus_icon = require('../../front-assets/plus_icon.png')
    const watchlists = useSelector(state => state.watchlist.watchlists)
    const watchlist_items = useSelector(state => state.watchlist.watchlist_items)
    
    const [watchlistId, setWatchlistId] = useState(0)
    const [newListName, setNewListName] = useState("")
    const [newListVisible, setNewListVisible] = useState('none')

    // load/reload watchlist and wlItems when wID changes
    useEffect(() => {
        dispatch(loadWatchlists(userId))
        dispatch(loadWatchlistItems(watchlistId))
    }, [watchlistId])

    // when watchlists loads, set selected WL default to the first list in the watchlists array if there are any
    useEffect(() => {
        if (watchlists && watchlistId === 0) {
            if (watchlists.length > 0) {
                setWatchlistId(watchlists[0].id)
            }
        }
    }, [watchlists])

    // reveal new list form
    const showNewListForm = () => setNewListVisible('')

    // submit new list form
    const newListOnSubmit = (e) => {
        e.preventDefault()
        dispatch(addWatchlist(newListName, userId))
        setNewListVisible('none')
    }

    // cancel & hide new list form div
    const newListOnCancel = (e) => {
        e.preventDefault()
        setNewListName('')
        setNewListVisible('none')
    }

    // delete selected list
    const deleteList = () => {
        dispatch(deleteWatchlist(watchlistId))
        setTimeout(() => setWatchlistId(0), [1000]) 
        // added 1s buffer before resetting the wL_ID so that the deleteWL thunk finishes before triggering the watchlist & watchlistItem reloading useEffect above
    }

    return (

        <div className='watchlist-container'>
            <div>
                <div className='flex-container-between watchlist-header'>
                    <div>Lists</div>
                    <img alt='plus' className='add-watchlist-button' src={plus_icon} onClick={showNewListForm}></img>
                </div>
                <form style={{'display':`${newListVisible}`}} className='new-watchlist' onSubmit={newListOnSubmit}>
                    <div className='flex-container new-watchlist-section'>
                        <input style={{'marginLeft': '5px'}} className='' value={newListName} type='text' placeholder='List name...' onChange={(e) => setNewListName(e.target.value)}></input>
                    </div>
                    <div className='flex-container-around new-watchlist-section'>
                        <button onClick={newListOnCancel}>Cancel</button>
                        <button type="submit">Create List</button>
                    </div>
                </form>
                <form className='watchlist-selection'>
                    <select value={watchlistId} onChange={(e) => setWatchlistId(e.target.value)} >
                        { watchlists && watchlists.map(list => {
                            return <option key={`watchlist${list.id}`} value={list.id}>{list.name}</option>
                        })}
                    </select>
                </form>
            </div>
            <div>
                { watchlist_items && watchlist_items.map((item,idx) => {
                    return <WatchlistItem key={`${item}-${idx}`} stock={item.ticker}/>
                })}
            </div>
            <div className='watchlist-button flex-container'>
                <button className='remove-watchlist' onClick={deleteList}>Remove List</button>
            </div>
        </div>
    )
}

export default Watchlist;
