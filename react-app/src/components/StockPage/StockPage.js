import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router';
import { createChart } from 'lightweight-charts';

const StockPage = () => {
    const { ticker } = useParams()
    const chartContainer = useRef(null)
    const priceContainer = useRef(null)
    const [profile, setProfile] = useState({})
    const [pastData, setPastData] = useState([])

    
    // async function to fetch company profile info from Finnhub
    const fetchCompanyProfile = async() => {
        let response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=c27ut2aad3ic393ffql0`, { json: true })
        if(response.ok){
            let profileData = await response.json()
            setProfile(profileData)
        } 
    }

    // const fetchHistoricalData = async () => {
    //     let start = 1620230400 // May 5th, 12pm
    //     let end = 1620234000 // May 5th, 1pm
    //     console.log(end)
    //     console.log(start)
    //     let response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=1&from=${start}&to=${end}&token=c27ut2aad3ic393ffql0`, { json: true })
    //     if (response.ok) {
    //         let pastData = await response.json()
    //         console.log(pastData)
    //         setPastData(pastData)
    //     }
    // }
    // `https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=1&from=${past60min}&to=${now}&token=c27ut2aad3ic393ffql0`

    let priceSocket;
    // async function to fetch company stock price data from Finnhub
    const mountSocket = () => {
        priceSocket = new WebSocket('wss://ws.finnhub.io?token=c27ut2aad3ic393ffql0');

        // fetchHistoricalData() // commented out for now

        let container = chartContainer.current
        let priceDiv = priceContainer.current
        let chart = createChart(container, {
            width: 600,
            height: 300,
            layout: {
                backgroundColor: '#ffffff',
                textColor: 'var(--GREEN_TEXT)',
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: true,
                borderColor: 'rgba(197, 203, 206, 0.8)'
            },
            priceScale: {
                position: 'right',
                autoScale: true,
                invertScale: false,
                alignLabels: true,
                borderVisible: false,
                borderColor: 'rgba(197, 203, 206, 0.8)',
                scaleMargins: {
                    top: 0.2,
                    bottom: 0.2,
                },
            },
        });

        var lineSeries = chart.addLineSeries();
        // lineSeries.setData(sampleSeedData);

        // Connection opened -> Subscribe
        priceSocket.addEventListener('open', function (event) {
            priceSocket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': ticker }))
            console.log(`priceSocket opened for ${ticker}!`)
        });

        let lastTime = null;
        // Listen for messages
        priceSocket.addEventListener('message', function (event) {
            let data = JSON.parse(event.data).data
            if(data){
                let time = data[data.length-1]['t']/1000; // unix timestamp in ms, convert to secs by dividing by 1000
                let price = data[data.length-1]['p'];
                if(lastTime === null){ // if first data point, set 'lastTime' to the first instance
                    lastTime = time
                    let newPricePoint = { 'time': time, 'value': price }
                    priceDiv.innerHTML = newPricePoint['value'];
                    lineSeries.update(newPricePoint);
                    console.log('FIRST', time)
                } else if (lastTime < time){ // otherwise, check that new time is greater than last time to avoid errors
                    lastTime = time
                    let newPricePoint = {'time':time, 'value':price}        
                    priceDiv.innerHTML = newPricePoint['value'];
                    lineSeries.update(newPricePoint);
                    console.log('UPDATED', time)
                } 
            }
        });
    }

    // Unsubscribe from price websocket
    const unmountSocket = () => {
        if(priceSocket){
            priceSocket.send(JSON.stringify({ 'type': 'unsubscribe', 'symbol': ticker }))
            priceSocket.close()
            console.log(`websocket for ${ticker} is closed`)
        }
    }

    // fetch company profile data on load
    useEffect(() => {
        fetchCompanyProfile()
        mountSocket()
        return () => unmountSocket()
    }, [])
    
    return (
        <div className='stock-page-container'>
            <div className="stock-chart flex-container-stack">
                <h2>Stock Chart - #{ticker}</h2>
                <div ref={priceContainer}></div>
                <div ref={chartContainer}></div>
            </div>
            <div className="stock-info">
                <h3>Name: {profile.name}</h3>
                <h3>Market Cap ($M): {profile.marketCapitalization}</h3>
                <h3>URL: {profile.weburl}</h3>
                <h3>Industry: {profile.finnhubIndustry}</h3>
                <img src={profile.logo}></img>
            </div>
            <div className="stock-order flex-container">
                <h3>Order Form</h3>
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
//     { time: 1557144000, value: 229.46 },
//     { time: 1557147600, value: 230.98 },
//     { time: 1557151200, value: 231.71 },
//     { time: 1557154800, value: 232.8 },
//     { time: 1557212400, value: 233.1 },
//     { time: 1557216000, value: 232.9 },
//     { time: 1557219600, value: 232.9 },
//     { time: 1557223200, value: 232.76 },
//     { time: 1557226800, value: 232.41 },
//     { time: 1557230400, value: 231.2 },
//     { time: 1557234000, value: 230.83 },
//     { time: 1557237600, value: 230.57 },
//     { time: 1557241200, value: 231.49 },
//     { time: 1557298800, value: 231.5 },
//     { time: 1557302400, value: 230.87 },
//     { time: 1557306000, value: 229.79 },
//     { time: 1557309600, value: 230.06 },
//     { time: 1557313200, value: 230.53 },
//     { time: 1557316800, value: 231.04 },
//     { time: 1557320400, value: 230.63 },
//     { time: 1557324000, value: 230.83 },
//     { time: 1557327600, value: 230 },
//     { time: 1557471600, value: 228.8 },
//     { time: 1557475200, value: 227.73 },
//     { time: 1557478800, value: 227.73 },
//     { time: 1557482400, value: 227.84 },
//     { time: 1557486000, value: 228.2 },
//     { time: 1557489600, value: 228.33 },
//     { time: 1557493200, value: 228.6 },
//     { time: 1557496800, value: 227.11 },
//     { time: 1557500400, value: 227 },
//     { time: 1557730800, value: 226.29 },
//     { time: 1557734400, value: 227.04 },
//     { time: 1557738000, value: 227.97 },
//     { time: 1557741600, value: 227.85 },
//     { time: 1557745200, value: 227.13 },
//     { time: 1557748800, value: 225.64 },
//     { time: 1557752400, value: 224.46 },
//     { time: 1557756000, value: 225.22 },
//     { time: 1557759600, value: 224.22 },
//     { time: 1557817200, value: 225.9 },
//     { time: 1557820800, value: 226.15 },
//     { time: 1557824400, value: 227.9 },
//     { time: 1557828000, value: 228.86 },
//     { time: 1557831600, value: 228.83 },
//     { time: 1557835200, value: 228.17 },
//     { time: 1557838800, value: 228.71 },
//     { time: 1557842400, value: 227.68 },
//     { time: 1557846000, value: 227.88 },
//     { time: 1557903600, value: 227.67 },
//     { time: 1557907200, value: 227.52 },
//     { time: 1557910800, value: 226.05 },
//     { time: 1557914400, value: 224.54 },
//     { time: 1557918000, value: 225.96 },
// ]