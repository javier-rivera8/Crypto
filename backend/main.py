from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes restringir esto a dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/bitcoin-history")
def get_bitcoin_history():
    url = "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart"
    params = {"vs_currency": "usd", "days": "30", "interval": "daily"}
    
    response = requests.get(url, params=params)
    data = response.json()

    history = []
    for i, (timestamp, price) in enumerate(data["prices"]):
        date = datetime.utcfromtimestamp(timestamp / 1000).strftime('%Y-%m-%d')
        prev_price = data["prices"][i - 1][1] if i > 0 else price
        change = ((price - prev_price) / prev_price) * 100 if i > 0 else 0

        history.append({"date": date, "price": round(price, 2), "change": round(change, 2)})

    return {"history": history}
