import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadTrades } from '../../store/trade'
import { loadPortfolio } from '../../store/portfolio';
import LedgerItem from './LedgerItem';


const HistoryPage = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user)
    const user_portfolio = useSelector(state => state.portfolio.portfolio)
    const trades = useSelector(state => state.trade.trades)
    
    let reversed;
    if(trades) reversed = trades.slice(0).reverse() // show trades with most recent activity first

    // load user portfolio after user pulled from state
    useEffect(() => {
        if (user) dispatch(loadPortfolio(user.id))
    }, [user])
    
    //  load trades in users portfolio after portfolio loaded into state
    useEffect(() => {
        if (user_portfolio) dispatch(loadTrades(user_portfolio.id))
    }, [user_portfolio])
    
    return (
        <div className='history-page-container'>
            <div className="">
                <h1 style={{'marginBottom':'0px'}}>{user.username}</h1>
                <div className="history-ledger-container">
                    <h2> Transaction Ledger</h2>
                        {reversed && reversed.map(trade => (
                            <LedgerItem key={`history_trade_${trade.id}`} trade={trade}></LedgerItem>
                        ))}
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default HistoryPage;