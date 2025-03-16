import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const App = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bitcoinHistory, setBitcoinHistory] = useState([]);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false")
      .then((response) => response.json())
      .then((data) => {
        setCryptoData(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily")
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.prices.map((entry) => ({
          date: new Date(entry[0]).toLocaleDateString(),
          price: entry[1],
        }));
        setBitcoinHistory(formattedData);
      })
      .catch((error) => console.error("Error fetching Bitcoin history:", error));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Crypto Market</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table className="crypto-table">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Coin</th>
                <th className="table-cell">Price</th>
                <th className="table-cell">Market Cap</th>
                <th className="table-cell">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((coin) => (
                <tr key={coin.id} className="table-row">
                  <td className="coin-info">
                    <img src={coin.image} alt={coin.name} className="coin-image" />
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </td>
                  <td className="table-cell">${coin.current_price.toLocaleString()}</td>
                  <td className="table-cell">${coin.market_cap.toLocaleString()}</td>
                  <td className={`table-cell ${coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}`}>
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h2 className="title">Bitcoin Price Trend (Last Year)</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bitcoinHistory}>
            <XAxis dataKey="date" hide={true} />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#FFD700" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default App;

/* Styles */
const styles = `
.container {
  min-height: 100vh;
  background-color: #1a202c;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
}

.title {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 24px;
}

.table-container {
  width: 100%;
  max-width: 64rem;
}

.crypto-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #4a5568;
}

.table-header {
  background-color: #2d3748;
}

.table-cell {
  padding: 12px;
  border: 1px solid #4a5568;
  text-align: center;
}

.table-row {
  text-align: center;
  border: 1px solid #4a5568;
}

.coin-info {
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.coin-image {
  width: 24px;
  height: 24px;
}

.positive {
  color: #48bb78;
}

.negative {
  color: #e53e3e;
}

.chart-container {
  width: 100%;
  max-width: 64rem;
  height: 300px;
  margin-top: 24px;
}
`;

const styleTag = document.createElement("style");
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);