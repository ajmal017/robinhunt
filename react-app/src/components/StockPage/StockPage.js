import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router';
import { createChart } from 'lightweight-charts';
import { loadPortfolio } from '../../store/portfolio'
import { loadTrades } from '../../store/trade'
import { loadWatchlists, loadWatchlistItems, addWatchlistItem, deleteWatchlistItem } from '../../store/watchlist';
import OrderForm from './OrderForm';

// https://finnhub.io/docs/api/websocket-trades
// https://finnhub.io/docs/api/quote
// https://www.unixtimestamp.com/

const StockPage = () => {
    const { ticker } = useParams()
    const dispatch = useDispatch()
    const chartContainer = useRef(null)
    const priceContainer = useRef(null)
    const [profile, setProfile] = useState({})
    const [summary, setSummary] = useState({})
    const [financials, setFinancials] = useState({})
    const [lastPrice, setLastPrice] = useState(0)
    const [holdings, setHoldings] = useState([]);
    
    const user = useSelector(state => state.session.user)
    const user_portfolio = useSelector(state => state.portfolio.portfolio)
    const trades = useSelector(state => state.trade.trades)
    const watchlists = useSelector(state => state.watchlist.watchlists)

    const [watchlistId, setWatchlistId] = useState(1)
    const [listFormVisible, setListFormVisible] = useState(false)

    let userId, cashBalance, portfolioId, watchlist;
    user ? userId = user.id : userId = ""
    user_portfolio ? cashBalance = user_portfolio.cash_balance : cashBalance = 0
    user_portfolio ? portfolioId = user_portfolio.id : cashBalance = ""
    
    // const [pastData, setPastData] = useState([])
    // const [series, setSeries] = useState(null);
    // const [socket, setSocket] = useState(null);

    let lineSeries, priceSocket, pastData, prevClose;
    const currencyFormatter = (num) => Number(num).toFixed(2)
    
    const initialize = async () => {
        // identify placement of chart in DOM
        let container = chartContainer.current
        // create chart 
        let chart = createChart(container, {
            width: 700,
            height: 300,
            layout: {
                backgroundColor: '#ffffff',
                textColor: 'green',
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            localization: {
                dateFormat: 'MM/dd/yy',
                locale: 'en-US',
            },
            priceScale: {
                position: 'right',
                autoScale: true,
                invertScale: false,
                alignLabels: true,
                borderVisible: false,
                borderColor: 'rgba(197, 203, 206, 0.8)',
                scaleMargins: {
                    top: 0.3,
                    bottom: 0.4,
                },
            },
            timeScale: {
                rightOffset: 3,
                barSpacing: 3,
                fixLeftEdge: true,
                lockVisibleTimeRangeOnResize: true,
                rightBarStaysOnScroll: true,
                borderVisible: false,
                borderColor: '#fff000',
                visible: false,
                timeVisible: true,
            },
            crosshair: {
                vertLine: {
                    color: '#222b37',
                    width: 0.5,
                    style: 0,
                    visible: true,
                    labelVisible: true,
                },
                horzLine: {
                    color: '#6A5ACD',
                    width: 0.5,
                    style: 0,
                    visible: false,
                    labelVisible: true,
                },
                mode: 1,
            },
        });

        // add line-series or area type to initial chart || https://www.cssscript.com/financial-chart/
        lineSeries = chart.addAreaSeries({
            topColor: '#e5f9e6',
            bottomColor: '#f5f8fa',
            lineColor: '#40c802',
            lineStyle: 0,
            lineWidth: 2,
            crosshairMarkerVisible: true,
            crosshairMarkerRadius: 3,
        });
    }

    // grab historical chart data (1min) || API: https://www.alphavantage.co/documentation/
    const fetchHistoricalData = async (series) => {
        // Alpha Vantage API KEY: 09CXQ7G0M8U90O13
        let key = '09CXQ7G0M8U90O13'
        let response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&outputsize=full&apikey=${key}`)
        if (response.ok) {
            let data = await response.json()
            let seriesData = data['Time Series (1min)'] 
            // console.log(seriesData)
            let historical = []
            for (let key in seriesData){
                let datetime = new Date(key).getTime()/1000; // convert to unix timestamp for lwChart
                let price = Number(seriesData[key]['4. close']) // grab close price, convert to num data type
                historical.push({'time':datetime, 'value':price }) // add new data point obj to historical array
            }
            let last360 = historical.slice(0, 360)
            prevClose = last360[0]['value']
            pastData = last360.reverse(); // historical data is sent most recent first... so need to reverse the order
            series.setData(pastData)
        }
    }

    //!! NOTE: API LIMITED TO 5 CALLS PER MINUTE  !!// 
    const fetchCompanyOverview = async (series) => {             
        // Alpha Vantage API KEY: 09CXQ7G0M8U90O13
        let key = '09CXQ7G0M8U90O13'
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
            // console.log(financialMetrics)
            setFinancials(financialMetrics)
        }
    }

    // async function to fetch company stock price data from Finnhub
    const mountSocket = (series) => {

        // create websocket connection to finnhub using my API key
        priceSocket = new WebSocket('wss://ws.finnhub.io?token=c27ut2aad3ic393ffql0');
        // await setSocket(priceSocket)
        // console.log('init set socket')

        // Connection opened -> Subscribe
        priceSocket.addEventListener('open', function (event) {
            priceSocket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': ticker }))
            console.log(`priceSocket opened for ${ticker}!`)
        });

        let lastTime = null;
        // Listen for messages; only allow update when next time >> last time
        priceSocket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data).data
            if(data){
                let time = data[data.length-1]['t']/1000; // unix timestamp in ms, convert to secs by dividing by 1000
                let price = data[data.length-1]['p'];
                if(lastTime === null){ // if first data point, set 'lastTime' to the first instance
                    lastTime = time
                    let newPricePoint = { 'time': time, 'value': price }
                    let displayPrice = '$' + currencyFormatter(newPricePoint['value'])
                    priceContainer.current.innerHTML = displayPrice;
                    series.update(newPricePoint);
                    // setLastPrice(newPricePoint['value'].toFixed(2))
                    // console.log('FIRST', time)
                } else if (lastTime < time){ // otherwise, check that new time is greater than last time to avoid errors
                    lastTime = time
                    let newPricePoint = {'time':time, 'value':price}      
                    let displayPrice = '$' + currencyFormatter(newPricePoint['value'])
                    priceContainer.current.innerHTML = displayPrice;
                    series.update(newPricePoint);
                    setLastPrice(newPricePoint['value'])
                    // console.log('UPDATED', time)
                } 
            }
        });
    }

    // Unsubscribe from price websocket and close
    const unmountSocket = (socket) => {
        if(socket){
            socket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': ticker }))
            socket.close()
        }
    }

    // remove container content on ticker change 
    const removeChart = () => {
        chartContainer.current.innerHTML = ''
        priceContainer.current.innerHTML = '...loading'
    }

    // load pre-req async functions in order first
    const loadSeries = async() => {
        await removeChart()
        await initialize()
        await fetchHistoricalData(lineSeries)
        await fetchCompanyOverview()
        await fetchCompanyProfile()
        await fetchCompanyFinancials()
    }

    // then create final load function to load initial series data, then establish the websocket connection
    const load = async() => {
        await loadSeries()
        mountSocket(lineSeries)
    }

    // run all functions on load in correct order via useEffect
    useEffect(() => {
        unmountSocket(priceSocket) // if ticker changes from search, unmount existing socket then reload
        load()
        return () => unmountSocket(priceSocket)
    }, [ticker])

    useEffect(() => {
        if (userId) dispatch(loadPortfolio(userId))
        if (userId) dispatch(loadWatchlists(userId))
        dispatch(loadWatchlistItems(watchlistId))
    }, [userId, watchlistId])

    useEffect(() => {
        if (portfolioId) {
            dispatch(loadTrades(portfolioId))
            // console.log('trades > ', trades)
        }
    }, [portfolioId])

    // console.log(trades)

    // WATCHLIST 

    let display;
    listFormVisible ? display = '' : display = 'none'

    const showListForm = () => setListFormVisible(true)

    const AddToListOnSubmit = (e) => {
        e.preventDefault()
        // console.log(Number(watchlistId))
        
        dispatch(addWatchlistItem(Number(watchlistId), ticker))
        setListFormVisible(false)
    }

    const cancel = (e) => {
        e.preventDefault()
        // setWatchlistId(1)
        setListFormVisible(false)
    }

    const remove = (e) => {
        e.preventDefault()
        dispatch(deleteWatchlistItem(Number(watchlistId), ticker))
        setListFormVisible(false)
    }

    // SELL ORDER REQUIRED

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
        for (let i = 0; i < trades.length; i++) {
            let trade = trades[i];
            let ticker = trade.ticker;
            let type = trade.order_type;
            let cost = trade.order_price;
            let volume = trade.order_volume;
            if (!myHoldings.hasOwnProperty(ticker)) {
                myHoldings[ticker] = { volume, cost }
            } else {
                if (type == 'buy') {
                    myHoldings[ticker].cost = avgCost(myHoldings[ticker].volume, myHoldings[ticker].cost, volume, cost)
                    myHoldings[ticker].volume += volume
                } else if (type == 'sell') {
                    myHoldings[ticker].volume -= volume
                }
            }
        }
        let newHoldings = [];
        for (let key in myHoldings) {
            let holding = { 'ticker': key, 'volume': myHoldings[key].volume, 'cost': myHoldings[key].cost }
            newHoldings.push(holding);
        }
        // console.log(newHoldings)
        setHoldings(newHoldings)
        // contextHoldings.setContextHoldings(newHoldings)
        // dispatch(loadHoldings(newHoldings))
    }

    useEffect(() => {
        if (trades) {
            buildHoldings()
            // console.log('holdings', holdings)
        }
    }, [trades])
    // console.log(holdings)


    return (
        <div className='stock-page-container'>
            <div className="stock-chart">
                <h1 className='min-margin'>{profile.name}</h1>
                <h3 className='min-margin' ref={priceContainer}>...loading</h3>
                <div ref={chartContainer}></div>
            </div>
            <div className="profile-info-container">
                <div style={{ 'width': '95%' }}>
                    <div className='grey-underline'>
                        <h2 className=''> About</h2>
                    </div>
                    <div className='company-summary'>{summary.Description}</div>
                    <div className='info-container'>
                        <div className='flex-container-stack'>
                            <img alt='profile-logo' className='profile-logo' src={profile.logo}></img>
                        </div>
                        <div className='flex-container-stack min-margin'>
                            <h4 className='min-margin'>About</h4>
                            <a href={profile.weburl}>{profile.name}</a>
                        </div>
                        <div className='flex-container-stack min-margin'>
                            <h4 className='min-margin'>Industry</h4>
                            <p>{profile.finnhubIndustry}</p>
                        </div>
                        <div className='flex-container-stack'>
                            <h4 className='min-margin'>Mkt Cap</h4>
                            <p>{Number(profile.marketCapitalization / 1000).toFixed(2)}B</p>
                        </div>
                    </div>
                </div>
                <div style={{'width':'95%'}}>
                    <div className='grey-underline'>
                        <h2 className=''> Key Statistics</h2>
                    </div>
                    <div className='info-container'>
                        <div className='flex-container-stack'>
                            <h4 className='min-margin'>Beta</h4>
                            <p>{Number(financials.beta).toFixed(2)}</p>
                        </div>
                        <div className='flex-container-stack'>
                            <h4 className='min-margin'>EPS</h4>
                            <p>{Number(financials.epsNormalizedAnnual).toFixed(2)}</p>
                        </div>
                        <div className='flex-container-stack min-margin'>
                            <h4 className='min-margin'>P/E Ratio (TTM)</h4>
                            <p>{Number(financials.peBasicExclExtraTTM).toFixed(2)}</p>
                        </div>
                        <div className='flex-container-stack min-margin'>
                            <h4 className='min-margin'>52 Week Range</h4>
                            <p>{Number(financials['52WeekLow']).toFixed(2)} - {Number(financials['52WeekHigh']).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className='info-container'>
                        <div className='flex-container-stack min-margin'>
                            <h4 className='min-margin'>Quick (Y)</h4>
                            <p>{Number(financials.quickRatioAnnual).toFixed(2)}</p>
                        </div>
                        <div className='flex-container-stack min-margin'>
                            <h4 className='min-margin'>ROI (Y)</h4>
                            <p>{Number(financials.roiAnnual).toFixed(2)}</p>
                        </div>
                        <div className='flex-container-stack'>
                            <h4 className='min-margin'>Div Yield (5Y)</h4>
                            <p>{Number(financials.dividendYield5Y).toFixed(2)}</p>
                        </div>
                        <div className='flex-container-stack'>
                            <h4 className='min-margin'>Div Growth (5Y)</h4>
                            <p>{Number(financials.dividendGrowthRate5Y).toFixed(2)}%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="stock-order-container">
                <OrderForm stock={ticker} price={lastPrice} cashBalance={cashBalance} portfolioId={portfolioId} holdings={holdings}/>
            </div>
            <div className="add-to-watchlist">
                <p onClick={showListForm}>Update Watchlist</p>
                <div style={{'display':`${display}`}} className="add-to-watchlist-select">
                    <form className='add-to-list-form' onSubmit={AddToListOnSubmit}>
                        <select value={watchlistId} onChange={(e) => setWatchlistId(e.target.value)} >
                            {watchlists && watchlists.map(list => {
                                return <option value={list.id}>{list.name}</option>
                            })}
                        </select>
                        <div className='flex-container add adjust-list'>
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


// SAMPLE COMPANY PROFILE RESPONSE OBJ
// {
//     "country": "US",
//         "currency": "USD",
//             "exchange": "NASDAQ/NMS (GLOBAL MARKET)",
//                 "ipo": "1980-12-12",
//                     "marketCapitalization": 1415993,
//                         "name": "Apple Inc",
//                             "phone": "14089961010",
//                                 "shareOutstanding": 4375.47998046875,
//                                     "ticker": "AAPL",
//                                         "weburl": "https://www.apple.com/",
//                                             "logo": "https://static.finnhub.io/logo/87cb30d8-80df-11ea-8951-00000000092a.png",
//                                                 "finnhubIndustry": "Technology"
// }

// SAMPLE SOCKET RESPONSE DATA
// { "data": [{ "p": 7296.89, "s": "BINANCE:BTCUSDT", "t": 1575526691134, "v": 0.011467 }], "type": "trade" }

// SAMPLE CHART SEED DATA
// const sampleSeedData = [
//     { time: 1556877600, value: 230.12 },
//     { time: 1556881200, value: 230.24 },
//     { time: 1556884800, value: 230.63 },
//     { time: 1556888400, value: 231.35 },
//     { time: 1556892000, value: 232.24 },
//     { time: 1556895600, value: 232.52 },
//     { time: 1557126000, value: 228.71 },
//     { time: 1557129600, value: 228.88 },
//     { time: 1557133200, value: 228.18 },
//     { time: 1557136800, value: 228.89 },
//     { time: 1557140400, value: 229.05 },
// ]

// FINANCIALS OUTPUTS
// "metric": {
// "10DayAverageTradingVolume": 96.16453,
// "13WeekPriceReturnDaily": -4.36016,
// "26WeekPriceReturnDaily": 11.43976,
// "3MonthAverageTradingVolume": 2130.6997,
// "52WeekHigh": 145.09,
// "52WeekHighDate": "2021-01-25",
// "52WeekLow": 74.7175,
// "52WeekLowDate": "2020-05-06",
// "52WeekPriceReturnDaily": 72.20056,
// "5DayPriceReturnDaily": -4.10241,
// "assetTurnoverAnnual": 0.82884,
// "assetTurnoverTTM": 0.98974,
// "beta": 1.20907,
// "bookValuePerShareAnnual": 3.84873,
// "bookValuePerShareQuarterly": 4.1458,
// "bookValueShareGrowth5Y": -6.37004,
// "capitalSpendingGrowth5Y": -8.64702,
// "cashFlowPerShareAnnual": 3.9061,
// "cashFlowPerShareTTM": 5.07741,
// "cashPerSharePerShareAnnual": 5.35691,
// "cashPerSharePerShareQuarterly": 4.18511,
// "currentDividendYieldTTM": 0.64012,
// "currentEv/freeCashFlowAnnual": 45.87887,
// "currentEv/freeCashFlowTTM": 34.27354,
// "currentRatioAnnual": 1.3636,
// "currentRatioQuarterly": 1.14175,
// "dividendGrowthRate5Y": 9.83445,
// "dividendPerShare5Y": 0.674,
// "dividendPerShareAnnual": 0.795,
// "dividendYield5Y": 1.16156,
// "dividendYieldIndicatedAnnual": 0.68696,
// "dividendsPerShareTTM": 0.82,
// "ebitdPerShareTTM": 5.81037,
// "ebitdaCagr5Y": -1.0971,
// "ebitdaInterimCagr5Y": 4.92326,
// "epsBasicExclExtraItemsAnnual": 3.30859,
// "epsBasicExclExtraItemsTTM": 4.50369,
// "epsExclExtraItemsAnnual": 3.27535,
// "epsExclExtraItemsTTM": 4.45645,
// "epsGrowth3Y": 12.47869,
// "epsGrowth5Y": 7.28691,
// "epsGrowthQuarterlyYoy": 118.6195,
// "epsGrowthTTMYoy": 39.744,
// "epsInclExtraItemsAnnual": 3.27535,
// "epsInclExtraItemsTTM": 4.45645,
// "epsNormalizedAnnual": 3.27535,
// "focfCagr5Y": 0.3639,
// "freeCashFlowAnnual": 59284,
// "freeCashFlowPerShareTTM": 4.43816,
// "freeCashFlowTTM": 76246,
// "freeOperatingCashFlow/revenue5Y": 18.85883,
// "freeOperatingCashFlow/revenueTTM": 23.43104,
// "grossMargin5Y": 38.3595,
// "grossMarginAnnual": 38.23325,
// "grossMarginTTM": 39.88126,
// "inventoryTurnoverAnnual": 41.52296,
// "inventoryTurnoverTTM": 45.74535,
// "longTermDebt/equityAnnual": 151.9827,
// "longTermDebt/equityQuarterly": 157.047,
// "marketCapitalization": 2137686,
// "monthToDatePriceReturnDaily": -2.55591,
// "netDebtAnnual": 22154,
// "netDebtInterim": 51811,
// "netIncomeEmployeeAnnual": 404302.8,
// "netIncomeEmployeeTTM": 519122.4,
// "netInterestCoverageAnnual": null,
// "netInterestCoverageTTM": null,
// "netMarginGrowth5Y": -1.75179,
// "netProfitMargin5Y": 21.50219,
// "netProfitMarginAnnual": 20.91361,
// "netProfitMarginTTM": 23.45101,
// "operatingMargin5Y": 25.89906,
// "operatingMarginAnnual": 24.14731,
// "operatingMarginTTM": 27.32064,
// "payoutRatioAnnual": 24.53711,
// "payoutRatioTTM": 18.62379,
// "pbAnnual": 33.28369,
// "pbQuarterly": 30.89878,
// "pcfShareTTM": 24.50687,
// "peBasicExclExtraTTM": 26.91349,
// "peExclExtraAnnual": 39.11032,
// "peExclExtraHighTTM": 35.67625,
// "peExclExtraTTM": 28.74485,
// "peExclLowTTM": 10.90841,
// "peInclExtraTTM": 28.74485,
// "peNormalizedAnnual": 39.11032,
// "pfcfShareAnnual": 36.05839,
// "pfcfShareTTM": 28.03669,
// "pretaxMargin5Y": 26.59841,
// "pretaxMarginAnnual": 24.43983,
// "pretaxMarginTTM": 27.54344,
// "priceRelativeToS&P50013Week": -12.10344,
// "priceRelativeToS&P50026Week": -7.92374,
// "priceRelativeToS&P5004Week": -1.94981,
// "priceRelativeToS&P50052Week": 18.52101,
// "priceRelativeToS&P500Ytd": -12.99191,
// "psAnnual": 7.78714,
// "psTTM": 6.56929,
// "ptbvAnnual": 32.71684,
// "ptbvQuarterly": 30.90123,
// "quickRatioAnnual": 1.32507,
// "quickRatioQuarterly": 1.09269,
// "receivablesTurnoverAnnual": 14.06111,
// "receivablesTurnoverTTM": 19.01569,
// "revenueEmployeeAnnual": 1933204,
// "revenueEmployeeTTM": 2213646,
// "revenueGrowth3Y": 6.19294,
// "revenueGrowth5Y": 3.27041,
// "revenueGrowthQuarterlyYoy": 53.62612,
// "revenueGrowthTTMYoy": 21.42876,
// "revenuePerShareAnnual": 15.66132,
// "revenuePerShareTTM": 18.94139,
// "revenueShareGrowth5Y": 9.19987,
// "roaRfy": 17.33413,
// "roaa5Y": 15.67208,
// "roae5Y": 48.47848,
// "roaeTTM": 103.4003,
// "roeRfy": 73.68556,
// "roeTTM": 23.21042,
// "roi5Y": 22.05595,
// "roiAnnual": 25.44284,
// "roiTTM": 33.53747,
// "tangibleBookValuePerShareAnnual": 3.84873,
// "tangibleBookValuePerShareQuarterly": 4.1458,
// "tbvCagr5Y": -9.95011,
// "totalDebt/totalEquityAnnual": 173.0926,
// "totalDebt/totalEquityQuarterly": 175.8435,
// "totalDebtCagr5Y": 11.94642,
// "yearToDatePriceReturnDaily": -3.45919
// },