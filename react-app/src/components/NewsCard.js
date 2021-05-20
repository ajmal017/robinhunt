import React from "react";

// intentionally saved this component outside the Portfolio folder in order to apply on stock profile page later
const NewsCard = ({ article }) => {    
    const bolt = require('../front-assets/bolt.png')

    return (
        <a href={article.url} rel="noopener noreferrer" target="_blank">
            <div className="news-card-container">
                <div className='news-info-container'>
                    <p className='news-source boldest'>
                        <img alt='bolt' style={{'width':'10px', 'marginRight':'8px'}} src={bolt}></img>{article.source}
                    </p>
                    <div className="news-title">
                        <p>{article.headline}</p>
                    </div>
                    <div className='news-source boldest capitalize'>
                        {article.category}
                    </div>
                </div>
                <div className='news-image-container'>
                    <img alt='article-pic' className="news-image" src={article.image}></img>
                </div>
            </div>
        </a>
    )
}

export default NewsCard;