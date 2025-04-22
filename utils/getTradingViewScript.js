const getTradingViewScript = (symbol) => `  
<html>  
  <head>  
    <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>  
    <style>
      body {
        background-color: #161616; /* Set your desired background color here */
        width: 100%;
        height: 95vh;
        margin: 0; /* Remove default margin */
        padding: 0; /* Remove default padding */
      }
      .tradingview-widget-container {
        width: 100%;
        height: 95vh;
        background-color: #161616; /* Set the widget container background color */
      }
    </style>
  </head>  
  <body>  
    <div class="tradingview-widget-container">  
      <div id="tradingview_12345"></div>  
      <script type="text/javascript">  
        new TradingView.widget({  
          "container_id": "tradingview_12345",  
          "width": "100%",  
          "height": "100%",  
          "symbol": "${symbol}",  
          "interval": "D",  
          "timezone": "Etc/UTC",  
          "theme": "dark",  
          "style": "1",  
          "locale": "en",  
          "toolbar_bg": "#ff0000",  
          "enable_publishing": true,  
          "allow_symbol_change": true,  
          "showPopupButton": true,  
          "popupWidth": "1000",  
          "popupHeight": "650",  
          "detail": true,  
          "studies": [],  
          "watchlist": [],  
          "hotlist": [],  
          "theme": "dark",  
          "container_id": "tradingview_12345"  
        });  
      </script>  
    </div>  
  </body>  
</html>  
`;

export default getTradingViewScript;
