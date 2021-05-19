import React from "react";

const NewsCard = ({ article }) => {    
    const bolt = require('../front-assets/bolt.png')

    return (
        <a href={article.url} target="_blank">
            <div className="news-card-container">
                <div className='news-info-container'>
                    <p className='news-source boldest'>
                        <img style={{'width':'10px', 'marginRight':'8px'}} src={bolt}></img>{article.source}
                    </p>
                    <div className="news-title">
                        <p>{article.headline}</p>
                    </div>
                    <div className='news-source boldest capitalize'>
                        {article.category}
                    </div>
                </div>
                <div className='news-image-container'>
                    <img className="news-image" src={article.image}></img>
                </div>
            </div>
        </a>
    )
}

export default NewsCard;

// FINNHUB API: SAMPLE NEWS OBJ RESPONSE
// {
//     "category": "technology",
//         "datetime": 1596589501,
//             "headline": "Square surges after reporting 64% jump in revenue, more customers using Cash App",
//                 "id": 5085164,
//                     "image": "https://image.cnbcfm.com/api/v1/image/105569283-1542050972462rts25mct.jpg?v=1542051069",
//                         "related": "",
//                             "source": "CNBC",
//                                 "summary": "Shares of Square soared on Tuesday evening after posting better-than-expected quarterly results and strong growth in its consumer payments app.",
//                                     "url": "https://www.cnbc.com/2020/08/04/square-sq-earnings-q2-2020.html"
// },