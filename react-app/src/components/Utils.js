// HOLDINGS 
// helper function: cost averaging helper for buildHoldings
export const avgCost = (volume, cost, newShares, newPrice) => {
    let existingCost = volume * cost; // current total cost for all trades of this ticker
    let newTradeCost = newShares * newPrice; // new transaction cost from a new trade
    let totalVolume = volume + newShares; // total volume of share, including new trade
    let averageCost = (existingCost + newTradeCost) / totalVolume // simple avg calculation
    return averageCost;
}

// helper function: aggregates trade data for simplified portfolio component rendering and fetches
export const buildHoldings = (trades, setHoldingsFunction) => {
    let myHoldings = {}; // init holdings obj
    for (let i = 0; i < trades.length; i++) {
        let trade = trades[i]; //  grab each trades ...
        let ticker = trade.ticker; // stock ticker
        let trade_type = trade.order_type; // buy vs sell type
        let trade_cost = trade.order_price; // transaction price per share
        let trade_volume = trade.order_volume; // volume of shares

        if (!myHoldings.hasOwnProperty(ticker)) {  // if don't already own shares of this stock...
            myHoldings[ticker] = { trade_volume, trade_cost } // add a new key in myHoldings (i..e the ticker name) with a value == a new obj with volume/cost properties stored
        } else {
            if (trade_type === 'buy') {  // if buy...
                myHoldings[ticker].cost = avgCost(myHoldings[ticker].volume, myHoldings[ticker].cost, trade_volume, trade_cost) // recalculate cost avg with new info
                myHoldings[ticker].volume += trade_volume // update volume
            } else if (trade_type === 'sell') { // if sell
                myHoldings[ticker].volume -= trade_volume // subtract out this trades volume; cost avg stays the same
            }
        }
    }

    let newHoldings = []; // init return holdings array
    for (let key in myHoldings) { // loop through updates holdings obj
        let holding = { 'ticker': key, 'volume': myHoldings[key].trade_volume, 'cost': myHoldings[key].trade_cost } // create obj for each ticker to fit chart template
        if (holding.volume > 0) newHoldings.push(holding);  // if volume for a given ticker still present, add to return holdings arr
    }
    setHoldingsFunction(newHoldings) // set holdings array in useState for use in other components
}