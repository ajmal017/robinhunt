import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import AsyncSelect from 'react-select/async'

const AsyncSearch = () => {
    const history = useHistory()
    const [inputValue, setInputValue] = useState(null)
    const [selectedValue, setSelectedValue] = useState(null)

    const handleInputChange = value => {
        setInputValue(value)
    };

    const handleChange = value => {
        let symbol = value['displaySymbol']
        history.push(`/stocks/${symbol}`)
    };

    const loadOptions = (inputValue) => {
        return fetch(`https://finnhub.io/api/v1/search?q=${inputValue}&token=c27ut2aad3ic393ffql0`, { json: true })
            .then(res => res.json())
            .then(data => data.result)
    }


    return (
       
        <div className="search-bar">
            {/* <pre>Input Value: "{inputValue}"</pre> */}
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={e => `${e.symbol}: ${e.description}`}
                getOptionValue={e => e.symbol}
                loadOptions={loadOptions}
                onInputChange={handleInputChange}
                onChange={handleChange}
            />
            {/* <pre>Selected Value: {JSON.stringify(selectedValue)}</pre> */}
        </div>

    );
}

export default AsyncSearch;

// STATIC TICKERS PULL
    // const getSymbols = async () => {
    //     let response = await fetch('https://finnhub.io/api/v1/stock/symbol?exchange=US&token=c27ut2aad3ic393ffql0', { json: true })
    //     if (response.ok) {
    //         let data = await response.json()
    //         let searchData = data.map(symbol => {
    //             return {'value': symbol.displaySymbol, 'label': `${symbol.displaySymbol}: ${symbol.description}`}
    //         })
    //         setSearchOptions(searchData)
    //         // console.log(searchData)
    //     }
    // }