import React from "react";

const CompanyProfile = ({ summary, profile, financials}) => {

    return (
            <div className="profile-info-container">
                <div style={{ 'width': '95%' }}>
                    <div className='grey-underline'>
                        <h2 className=''> About</h2>
                    </div>
                    <div className='company-summary'>{summary.Description}</div>
                    <div className='info-container'>
                        <div className='flex-container' >
                            <div style={{ 'backgroundImage': `url(${profile.logo})`, 'backgroundSize': 'cover', 'backgroundRepeat': 'no-repeat', 'width': '50px', 'height': '50px', 'marginLeft': '30px', 'marginTop': '5px' }}></div>
                        </div>
                        <div className='flex-container-stack min-margin'>
                            <h4 className='min-margin'>About</h4>
                            <a className='company-link' target="_blank" href={profile.weburl}>{profile.name}</a>
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
                <div style={{ 'width': '95%' }}>
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
    )
}

export default CompanyProfile;