import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

const StockPage = () => {
    const { ticker } = useParams()
    const history = useHistory()
    const [profile, setProfile] = useState({})
    const [lastTrade, setLastTrade] = useState({})
    // const [sockets, setSockets] = useState([])
    // console.log(history)

    // async function to fetch company profile info from Finnhub
    const fetchCompanyProfile = async() => {
        let response = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=c27ut2aad3ic393ffql0`, { json: true })
        if(response.ok){
            let profileData = await response.json()
            setProfile(profileData)
        } 
    }

    let priceSocket;
    // async function to fetch company stock price data from Finnhub
    const mountSocket = () => {
        priceSocket = new WebSocket('wss://ws.finnhub.io?token=c27ut2aad3ic393ffql0');

        // Connection opened -> Subscribe
        priceSocket.addEventListener('open', function (event) {
            priceSocket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': ticker }))
            console.log(`priceSocket opened for ${ticker}!`)
        });

        // Listen for messages
        priceSocket.addEventListener('message', function (event) {
            // console.log('Message from server: LAST PRICE', event.data);
            let data = JSON.parse(event.data).data
            if(data[0]){
                setLastTrade(data[0])
                console.log('Last Price: ', data[0].p)
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

    // useEffect(() => {
    //     console.log(lastTrade)
    // }, [lastTrade])

    
    return (
        <div className='stock-page-container'>
            <div className="stock-chart flex-container">
                <h2>Stock Chart - #{ticker}</h2>
            </div>
            <div className="stock-info">
                <h2>Name: {profile.name}</h2>
                <h2>Market Cap ($M): {profile.marketCapitalization}</h2>
                <h2>URL: {profile.weburl}</h2>
                <h2>Industry: {profile.finnhubIndustry}</h2>
                <img src={profile.logo}></img>
            </div>
            <div className="stock-order flex-container">
                <h2>Order Form</h2>
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