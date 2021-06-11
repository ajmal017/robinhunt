// REFACTOR FINISHED

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PortfolioContent from './PortfolioContent'
import Watchlist from './Watchlist';
import { loadPortfolio } from '../../store/portfolio'
import { loadTrades } from '../../store/trade'

const PortfolioPage = () => {
    const dispatch = useDispatch()
    const [news, setNews] = useState([])
    const [refreshCount, setRefreshCount] = useState(0)
    const [prices, setPrices] = useState(null)
    const [holdings, setHoldings] = useState([]);

    const user = useSelector(state => state.session.user)
    const user_portfolio = useSelector(state => state.portfolio.portfolio)
    const trades = useSelector(state => state.trade.trades)

    // NEWS
    // function to grab most recent 5 news articles
    const getNews = async() => {
        const response = await fetch('https://finnhub.io/api/v1/news?category=general&token=c27ut2aad3ic393ffql0', { json: true })
        if(response.ok) {
            let data = await response.json()
            let lastNews = data.slice(0, 5) // get first 5 results back only
            setNews(lastNews)
        }
    }

    // HOLDINGS 
    // helper function: cost averaging helper for buildHoldings
    const avgCost = (volume, cost, newShares, newPrice) => {
        let existingCost = volume * cost; // current total cost for all trades of this ticker
        let newTradeCost = newShares * newPrice; // new transaction cost from a new trade
        let totalVolume = volume + newShares; // total volume of share, including new trade
        let averageCost = (existingCost + newTradeCost) / totalVolume // simple avg calculation
        return averageCost;
    }
    
    // helper function: aggregates trade data for simplified portfolio component rendering and fetches
    const buildHoldings = () => {
        let myHoldings = {}; // init holdings obj

        for(let i = 0; i< trades.length; i++){
            let trade = trades[i]; //  grab each trades ...
            let ticker = trade.ticker; // stock ticker
            let type = trade.order_type; // buy vs sell type
            let cost = trade.order_price; // transaction price per share
            let volume = trade.order_volume; // volume of shares
        
            if (!myHoldings.hasOwnProperty(ticker)) {  // if don't already own shares of this stock...
                myHoldings[ticker] = {volume, cost} // add a new key in myHoldings (i..e the ticker name) with a value == a new obj with volume/cost properties stored
            } else {
                if (type === 'buy') {  // if buy...
                    myHoldings[ticker].cost = avgCost(myHoldings[ticker].volume, myHoldings[ticker].cost, volume, cost) // recalculate cost avg with new info
                    myHoldings[ticker].volume += volume // update volume
                } else if (type === 'sell'){ // if sell
                    myHoldings[ticker].volume -= volume // subtract out this trades volume; cost avg stays the same
                }
            }
        }

        let newHoldings = []; // init return holdings array
        for (let key in myHoldings){ // loop through updates holdings obj
            let holding = { 'ticker':key, 'volume':myHoldings[key].volume, 'cost':myHoldings[key].cost} // create obj for each ticker to fit chart template
            if(holding.volume > 0) newHoldings.push(holding);  // if volume for a given ticker still present, add to return holdings arr
        }
        setHoldings(newHoldings) // set holdings array in useState for use in other components
    }


    // PRICES
    // helper function: returns promise for loadPrices function; gets a single stock price from Finnhub API
    const getPrice = async(ticker) => {
        let res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c27ut2aad3ic393ffql0`, { json: true })
        return res.json()
    }    

    // loads all holding prices, then sets priceData variable once all returns from Promise.all()
    const loadPrices = async() => {
        if(holdings) {
            let allPrices = holdings.map(holding => getPrice(holding.ticker)) // returns array of promises that will return price info when resolved
            let priceData = await Promise.all(allPrices) // returns array of objects
            setPrices(priceData)
        }
    }
    
    // FETCH NEWS
    // grab news once on initial load
    useEffect(() => {
        getNews()
    }, [])
    
    // grabs latest news when user clicks 'show newer articles' button
    useEffect(() => { getNews() }, [refreshCount])


    // LOAD PORTFOLIO
    // load user's portfolio after user is loaded from state
    useEffect(() => {
        if(user) dispatch(loadPortfolio(user.id))
    }, [user])

    // load trades after user portfolio loads from state
    useEffect(() => {
        if (user_portfolio) dispatch(loadTrades(user_portfolio.id))
    }, [user_portfolio])

    
    // BUILD HOLDINGS DISPLAYS
    // build holdings array after user's trades load into state
    useEffect(() => {
        if (trades) buildHoldings()
    }, [trades])
    
    // get the latest prices for each holding once holdings array is built 
    useEffect(() => {
        if (holdings) loadPrices() 
    }, [holdings])
    

    // render portfolio content left; watchlists right
    return (
        <div className='portfolio-page-container'>
            <div className="portfolio-content flex-container">
            { user_portfolio && 
                    <PortfolioContent user={user} cashBalance={user_portfolio.cash_balance} 
                    portfolioId={user_portfolio.id} trades={trades} holdings={holdings} news={news} 
                    refreshCount={refreshCount} setRefreshCount={setRefreshCount} prices={prices}/>
            }
            </div>
            <div className="portfolio-watchlist">
                <Watchlist userId={user.id}/>
            </div>
        </div>
    )
}

export default PortfolioPage;