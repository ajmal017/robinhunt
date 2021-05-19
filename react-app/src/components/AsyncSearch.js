import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
       <>
            <div className="search-bar">
                <AsyncSelect
                    cacheOptions
                    value={selectedValue}
                    getOptionLabel={e => `${e.symbol}: ${e.description}`}
                    getOptionValue={e => e.symbol}
                    loadOptions={loadOptions}
                    onInputChange={handleInputChange}
                    onChange={handleChange}
                />
            </div>
        </>
    );
}

export default AsyncSearch;