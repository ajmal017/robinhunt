import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router';
import { loadPortfolio } from '../../store/portfolio'
import { loadTrades } from '../../store/trade'
import { loadWatchlists, loadWatchlistItems, addWatchlistItem, deleteWatchlistItem } from '../../store/watchlist';
import OrderForm from './OrderForm';
import StockChart from './StockChart';
import CompanyProfile from './CompanyProfile';
import { buildHoldings } from '../Utils';

// INFORMATIONAL RESOURCES FOR RELATED COMPONENTS // 
    // https://finnhub.io/docs/api/websocket-trades
    // https://finnhub.io/docs/api/quote
    // https://www.unixtimestamp.com/
    // https://www.npmjs.com/package/react-flip-numbers

const StockPage = () => {
    const alphaKey = process.env.ALPHA_VANTAGE_API_KEY
    const { ticker } = useParams()
    const dispatch = useDispatch()
    
    const [lastPrice, setLastPrice] = useState(0) // price indicator, populated from within chart listeners
    const [profile, setProfile] = useState({}) // company profile info
    const [summary, setSummary] = useState({}) // company summary description
    const [financials, setFinancials] = useState({}) // company financials data
    const [holdings, setHoldings] = useState([]); // aggregated user portfolio holdings, calc'd from util functions

    const [watchlistId, setWatchlistId] = useState(0)
    const [listFormVisible, setListFormVisible] = useState('none') // set display property for hidden WL div
    
    const user = useSelector(state => state.session.user)
    const user_portfolio = useSelector(state => state.portfolio.portfolio)
    const trades = useSelector(state => state.trade.trades)
    const watchlists = useSelector(state => state.watchlist.watchlists)

    // FUNCTIONS
    //!! NOTE: AV API LIMITED TO 5 CALLS PER MINUTE  -- SPEND WISELY // 
    const fetchCompanyOverview = async (series) => {             
        let key = alphaKey
        let response = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${key}`)
        if (response.ok) {
            let data = await response.json()
            setSummary(data)
        }
    }

    // async function to fetch company profile info from Finnhub
    const fetchCompanyProfile = async() => {
        let response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=c27ut2aad3ic393ffql0`, { json: true })
        if(response.ok){
            let profileData = await response.json()
            setProfile(profileData)
        }
    }

    // async function to fetch company financial data from Finnhub
    const fetchCompanyFinancials = async () => {
        let response = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all&token=c27ut2aad3ic393ffql0`, { json: true })
        if (response.ok) {
            let financialData = await response.json()
            let financialMetrics = financialData.metric
            setFinancials(financialMetrics)
        }
    }

    // load pre-req async functions in order first
    const loadCompanyData = async() => {
        await fetchCompanyOverview()
        await fetchCompanyProfile()
        await fetchCompanyFinancials()
    }

    // USE EFFECTS
    // run all functions on load in correct order via useEffect
    useEffect(() => {
        if(ticker) loadCompanyData()
    }, [ticker]) // added dependency for if ticker changes from search bar to reload new data

    // load user portfolio and watchlist data
    useEffect(() => {
        if (user) dispatch(loadPortfolio(user.id))
        if (user) dispatch(loadWatchlists(user.id))
    }, [dispatch, user])

    // load trade history data for user
    useEffect(() => { 
        if (user_portfolio) dispatch(loadTrades(user_portfolio.id)) 
    }, [dispatch, user_portfolio])

    useEffect(() => {
        if (watchlists && watchlistId === 0) { // set 1st list by default once watchlists load
            if (watchlists.length > 0) {
                setWatchlistId(watchlists[0].id)
            }
        }
        dispatch(loadWatchlistItems(watchlistId))
    },[watchlists, watchlistId])

    // adds user holdings back into state for purpose of validating sell order conditions
    useEffect(() => {
        if (trades) buildHoldings(trades, setHoldings)
    }, [trades])


    // WATCHLIST RELATED
    const showListForm = () => setListFormVisible('')
    
    const addToListOnSubmit = (e) => {
        e.preventDefault()
        dispatch(addWatchlistItem(Number(watchlistId), ticker))
        setListFormVisible('none')
    }

    const cancel = (e) => {
        e.preventDefault()
        setListFormVisible('none')
    }

    const remove = (e) => {
        e.preventDefault()
        dispatch(deleteWatchlistItem(Number(watchlistId), ticker))
        setListFormVisible('none')
    }

    // RETURN JSX
    return (
        <div className='stock-page-container'>
            <StockChart ticker={ticker} companyName={profile.name} lastPrice={lastPrice} setLastPrice={setLastPrice}/>

            <CompanyProfile summary={summary} profile={profile} financials={financials}/>

            { user_portfolio && 
            <OrderForm userId={user.id} stock={ticker} price={lastPrice} cashBalance={user_portfolio.cash_balance} portfolioId={user_portfolio.id} holdings={holdings}/> 
            }
            
            <div className="add-to-watchlist">
                <p onClick={showListForm}>Update Watchlists</p>
                <div style={{'display':`${listFormVisible}`}} className="add-to-watchlist-select">
                    <form className='add-to-list-form' onSubmit={addToListOnSubmit}>
                        <select value={watchlistId} onChange={(e) => setWatchlistId(e.target.value)} >
                            {watchlists && watchlists.map(list => {
                                return <option key={`list${list.id}`} value={list.id}>{list.name}</option>
                            })}
                        </select>
                        <div className='flex-container adjust-list'>
                            <button type='submit'>Add</button>
                            <button onClick={remove}>Remove</button>
                        </div>
                        <button onClick={cancel}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default StockPage;