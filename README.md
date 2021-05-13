![banner](https://github.com/eramsay20/robinhunt/blob/main/assets/banner.png?raw=true)

## Welcome to Robinhunt! 
***[Robinhunt](https://robinhunt.herokuapp.com/)*** is a clone of the popular [Robinhood](https://www.robinhood.com/) trading app that focuses on providing a commission-free stock trading platform to its users. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

The goal of this two week full-stack project was to have 3 fully functional core MVP features finished, which include:  
- Portfolio View - 
- Stock Chart View - 
- Dynamic Stock Search - 

In addition to the core features above, I was able to implement the following bonus features:

- Market News Feed -
- Watchlists - 
- Trade Executions (Buy & Sell) -

For more detailed info on the scope of the MVP features, check the MVP guide here. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### Login/Signup/Splash Pages 
When a user first tries to navigate to Robinhunt, they are auto redirected to a login splash page to sign into their account or sign up for a new one. The intent here was to limit feature accessibility without first creating or logging into an account. For simplicity of testing, I created an additional Demo User login button so others can check it out with sample cash and stock holdings seeded to see the full functionality on login. 

![Splash](#)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### Main/Portfolio Page (MVP Feat #1)
Once logged in, the user sees their portfolio dashboard as their 'home' page. On the left half of the screen lives a portfolio summary doughnut chart, a holdings table which shows the details and investment figures for each of the users open holdings, and a market news feed. Both the chart and the table are populated with the same array of holdings objects which were formatted on the frontend to render well. Each row in the holdings table makes an API fetch to Finnhub to grab the last known price for the stock, such that subsequent equity and net values can be calculated. 

![Portfolio](#)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### News Feed & Watchlists (Bonus Feats #1, #2)
The news feed and watchlists rendered on this page are the first two bonus features I was able to implement. The news feed make an API call to Finnhub that fetches the last 100 general market news stories from Finnhub and filters them to show the latest 5. The watchlist on the right half of the screen shows a list of watchlist items that contain the link to a specific stock and its current price. Users can click the top-right plus button to open a hidden input/form to create a new list, and click the 'Remove List' button at the bottom of the container to remove whichever list is selected from the dropdown select field. Stocks can be added to a given watchlist on the stock page (more info below)

![News & Splash](#)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;


### Dynamic Search Bar (MVP Feat #2)
When logged in, a nav bar spans the top of both the portfolio page and stock page. The 'search bar' is actually a select field, leveraging both a 'react-select' library component, and an API call to Finnhub to grab all US stock tickers to dynamic populate select options as a user types. 

![Search](#)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

 MORE TO COME
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;



&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

And that's about it! (happy dance!?!)

For more info about this project, checkout the full planning documentation links outlined in the project wiki page, [here!](https://github.com/eramsay20/robinhunt/wiki). 