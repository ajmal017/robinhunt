import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PortfolioContent from './PortfolioContent'
import { loadPortfolio } from '../../store/portfolio'
import { loadTrades } from '../../store/trade'
import { loadWatchlists, loadWatchlistItems, addWatchlist, deleteWatchlist } from '../../store/watchlist';
import Watchlist from './Watchlist';

const PortfolioPage = () => {
    const plus_icon = require('../../front-assets/plus_icon.png')
    const dispatch = useDispatch()
    const [news, setNews] = useState([])
    const [refreshCount, setRefreshCount] = useState(0)
    const [prices, setPrices] = useState(null)
    const [watchlistId, setWatchlistId] = useState(0)
    const [newListName, setNewListName] = useState("")
    const [newListVisible, setNewListVisible] = useState(false)
    const [holdings, setHoldings] = useState([]);

    const user = useSelector(state => state.session.user)
    const user_portfolio = useSelector(state => state.portfolio.portfolio)
    const trades = useSelector(state => state.trade.trades)
    const watchlists = useSelector(state => state.watchlist.watchlists)

    let userId, cashBalance, portfolioId;
    user ? userId = user.id : userId = ""
    user_portfolio ? cashBalance = user_portfolio.cash_balance : cashBalance = 0
    user_portfolio ? portfolioId = user_portfolio.id : cashBalance = ""

    const getNews = async() => {
        const response = await fetch('https://finnhub.io/api/v1/news?category=general&token=c27ut2aad3ic393ffql0', { json: true })
        if(response.ok) {
            let data = await response.json()
            let lastNews = data.slice(0, 5) // get first 5 results back only
            setNews(lastNews)
        }
    }

    // helper func for buildHoldings
    const avgCost = (oldVolume, oldCost, newVolume, newCost) => {
        let existingCost = oldVolume * oldCost;
        let newTradeCost = newVolume * newCost;
        let totalVolume = oldVolume + newVolume;
        let averageCost = (existingCost + newTradeCost) / totalVolume
        return averageCost;
    }
    
    // aggregates trade data for simplified portfolio component rendering and fetches
    const buildHoldings = () => {
        let myHoldings = {};
        for(let i = 0; i< trades.length; i++){
            let trade = trades[i];
            let ticker = trade.ticker;
            let type = trade.order_type;
            let cost = trade.order_price;
            let volume = trade.order_volume;
            if(!myHoldings.hasOwnProperty(ticker)){
                myHoldings[ticker] = {volume, cost}
            } else {
                if (type === 'buy') {
                    myHoldings[ticker].cost = avgCost(myHoldings[ticker].volume, myHoldings[ticker].cost, volume, cost)
                    myHoldings[ticker].volume += volume
                } else if (type === 'sell'){
                    myHoldings[ticker].volume -= volume
                }
            }
        }
        let newHoldings = [];
        for (let key in myHoldings){
            let holding = { 'ticker':key, 'volume':myHoldings[key].volume, 'cost':myHoldings[key].cost}
            if(holding.volume > 0) newHoldings.push(holding);
        }
        setHoldings(newHoldings)
    }

    // get stock price from Finnhub; returns promise for loadPrices function
    const getPrice = async(ticker) => {
        let res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c27ut2aad3ic393ffql0`, { json: true })
        return res.json()
    }    

    // loads all holding prices, then sets priceData variable once all returns from Promise.all()
    const loadPrices = async() => {
        if(holdings) {
            let allPrices = holdings.map(holding => getPrice(holding.ticker)) // returns array of promises
            let priceData = await Promise.all(allPrices) // returns array of objects
            setPrices(priceData)
        }
    }

    useEffect(() => {
        if (portfolioId) {
            dispatch(loadTrades(portfolioId))
        }
    }, [portfolioId])

    useEffect(() => {
        if (holdings) {
            loadPrices()
        }
    }, [holdings])
    
    useEffect(() => {
        getNews()
        if(userId) dispatch(loadPortfolio(userId))
        if (userId) dispatch(loadWatchlists(userId))
        if(trades) buildHoldings()
    }, [trades, userId])

    useEffect(() => {
        if (watchlists && watchlistId === 0) {
            if(watchlists.length > 0){
                setWatchlistId(watchlists[0].id)
            }
        }
    }, [watchlists])

    // grabs latest news when user clicks 'show newer articles' button
    useEffect(() => {
        getNews()
    }, [refreshCount])


    // WATCHLIST RELATED

    useEffect(() => {
        if (userId) dispatch(loadWatchlists(userId))
        dispatch(loadWatchlistItems(watchlistId))
    }, [watchlistId])

    let display;
    newListVisible ? display = '' : display = 'none'
    
    const showNewListForm = () => setNewListVisible(true)

    const newListOnSubmit = (e) => {
        e.preventDefault()
        dispatch(addWatchlist(newListName, userId))
        setNewListVisible(false)
    }

    const newListOnCancel = (e) => {
        e.preventDefault()
        setNewListName('')
        setNewListVisible(false)
    }

    const deleteList = () => {
        dispatch(deleteWatchlist(watchlistId))
        setWatchlistId(1)
    }

    return (
        <div className='portfolio-page-container'>
            <div className="portfolio-content flex-container">
                <PortfolioContent user={user} cashBalance={cashBalance} portfolioId={portfolioId} trades={trades} holdings={holdings} news={news} refreshCount={refreshCount} setRefreshCount={setRefreshCount} prices={prices}/>
            </div>
            <div className="portfolio-watchlist">
                <div className='watchlist-container'>
                    <div>
                        <div className='flex-container-between watchlist-header'>
                            <div>Lists</div>
                            <img alt='plus' className='add-watchlist-button' src={plus_icon} onClick={showNewListForm}></img>
                        </div>
                        <form style={{'display':`${display}`}} className='new-watchlist' onSubmit={newListOnSubmit}>
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
                    <Watchlist/>
                    <div className='watchlist-button flex-container'>
                        <button className='remove-watchlist' onClick={deleteList}>Remove List</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PortfolioPage;