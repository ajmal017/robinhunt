import React, { useEffect, useState } from "react";

const NewsCard = ({ article }) => {    

    // const formatDate = (unixStamp) => {
    //     let dateTime = new Date(unixStamp) // in unix
    //     let isoDate = dateTime.toISOString()
    //     let year = isoDate.slice(0,4)
    //     // console.log(year)
    //     let month = isoDate.slice(5, 7)
    //     // console.log(month)
    //     let day = isoDate.slice(8, 10)
    //     // console.log(day)
    //     let hour = isoDate.split('T')[1].slice(0,2)
    //     let minute = isoDate.split('T')[1].slice(3, 5)
    //     console.log(minute)
    //     console.log(isoDate)
    // }
    // formatDate(article.datetime)

    return (
        <div className="news-card-container">
            <div className='news-info-container'>
                <p className='min-margin bold'>{article.source}</p>
                <div className="news-title">
                    <a href={article.url}>{article.headline}</a>
                </div>
            </div>
            <div className='news-image-container'>
                <img className="news-image" src={article.image}></img>
            </div>
        </div>
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