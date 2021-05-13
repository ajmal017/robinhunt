![banner](https://github.com/eramsay20/robinhunt/blob/main/assets/banner.png?raw=true)

## Welcome to Robinhunt! 
***[Robinhunt](https://robinhunt.herokuapp.com/)*** is a clone of the popular [Robinhood](https://www.robinhood.com/) trading app that focuses on providing a commission-free stock trading platform to its users. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

The goal of this two week full-stack project was to have 3 fully functional core MVP features finished, which include:  
- Portfolio View - be able to see a summary of the user's portfolio holdings
- Stock Chart View - view a real-time stock chart for a selected stock
- Dynamic Stock Search - be able to search for a stock and have the search show options as you type the stock symbol in the search bar

In addition to the core features above, I was able to implement the following bonus features:

- Market News Feed - render a feed of market news updated on every page refresh
- Watchlists - create/delete watchlists and watchlists items that link to their stock page and show the latest pricing infomation
- Mock Trade Executions (Buy & Sell) - be able to place buy and sell trade executions and have them update your portfolio and cash balance

For more detailed info on the scope of the MVP features, check the MVP guide here. 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### Login/Signup/Splash Pages 
When a user first tries to navigate to Robinhunt, they are auto redirected to a login splash page to sign into their account or sign up for a new one. The intent here was to limit feature accessibility without first creating or logging into an account. For simplicity of testing, I created an additional Demo User login button so others can check it out with sample cash and stock holdings already seeded in order to see the full functionality on login. 

![Splash](https://github.com/eramsay20/robinhunt/blob/main/assets/completed/login_splash.png?raw=true)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### Main/Portfolio Page (MVP Feat #1)
Once logged in, the user views their portfolio dashboard as their 'home' page. In the upper left corner of the screen lives a portfolio summary doughnut chart and a holdings table which shows the details and investment figures for each of the users open holdings. Both the chart and the table are populated with the same array of holdings objects which were created by aggregating a user's trade orders info a 'holding' for each stock symbol. Each row in the holdings table then makes an API fetch to Finnhub to grab the last known price for the stock, such that subsequent equity and net values can be calculated for each position. 

![Portfolio](https://github.com/eramsay20/robinhunt/blob/main/assets/completed/portfolio_summary.png?raw=true)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### Dynamic Search Bar (MVP Feat #2)
When logged in, a nav bar spans the top of both the portfolio page and stock page. The 'search bar' is actually a select field, leveraging both a 'react-select' package component and an API call to Finnhub to grab all US stock tickers. With these two linked, the select options to choose from below the input field dynamic populate as a user types. This ensures the user selects a valid stock symbol even if the data for the selected stock is limited, and thus avoids the need for a custom search results page and avoids typo errors.  

![Search](https://github.com/eramsay20/robinhunt/blob/main/assets/completed/dynamic_search.png?raw=true)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### Stock Profile and Chart (MVP Feat #3)
When a user either searches for a stock or clicks a link from the holdings table or watchlist, they will be brought to a stock profile page (see image below; Robinhunt left, Robinhood right). The stock page renders a line chart using a LightWeight chart line series template that I styled to look like Robinhood's. This chart loads historical 1min time-series data from AlphaAdvantage and then opens a websocket from Finnhub for the selected stock in order to receive real-time pricing updates as orders are placed. Below the chart lives company profile information for the selected stock which includes a written overview of the company, its logo, a link to its website and popular financial metrics seen on many financial media sites. 

![Stock Chart](https://github.com/eramsay20/robinhunt/blob/main/assets/completed/stock_page_chart_info.png?raw=true)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### News Feed & Watchlists (Bonus Feats #1, #2)
The news feed and watchlists rendered on the portfolio page are the first two bonus features I was able to implement. The news feed makes an API call to Finnhub that fetches the latest 100 market news stories available from Finnhub and filters them to show the latest 5 instead. The watchlist on the right half of the screen shows a list of watchlist items that contain a link to the watchlist item's stock page and displays its current price whenever the page is refreshed. Users can click the plus button in the top right corner of the watchlist component to open a hidden input/form allowing the user to create a new list. Likewise, a user can click the 'Remove List' button at the bottom of the container to delete whichever list is currently selected from the dropdown select field above the watchlist items (i.e. 'Tech' in the screenshot below). Stocks can be added or removed from a given watchlist on the stock page component (more info on this below).

![News & Watchlist](https://github.com/eramsay20/robinhunt/blob/main/assets/completed/news_watchlists.png?raw=true)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

### Order Execution & Watchlist Updates (Bonus #3)
Another key bonus feature was the order execution component on the stock profile page. The right side of the screen displays an order summary form that allows users to buy or sell shares of the selected stock. The user selects an order type (buy vs sell), enters the number of shares they wish to purchase or sell, and then sees the estimated cost or return value for the given order type which updates in real-time as the price socket info is added to the chart. Once a positive quantity of shares has been provided and the estimated cost/value figure displayed is greater than zero, a user clicks a 'Review Order' button and can view a confirmation message summarizing the trade details before clicking either 'Confirm' or 'Cancel'. Assuming the user has either enough funds to purchase the shares, or has enough shares in their portfolio to sell the desired quantity, they will be allow to click confirm and the mock trade is executed. When confirmed, an 'order complete!' animation appears in place of the confirmation text and then redirects the user back to the portfolio page after ~3 seconds to see their order now reflected in their holdings summary and their cash balance updated. Additionally, below the order form lives an 'Update Watchlists' button, which when clicked reveals a hidden form with buttons to add or remove the stock from a given watchlist. 

![Orders](https://github.com/eramsay20/robinhunt/blob/main/assets/completed/order_exec_watchlist.png?raw=true)


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

And that's about it! (happy dance!?!)

For more info about what went into to making this project, checkout the full planning documentation links outlined in the project wiki page, [here!](https://github.com/eramsay20/robinhunt/wiki). 
