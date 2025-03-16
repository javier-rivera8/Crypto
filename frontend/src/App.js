import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await fetch("http://localhost:8000/bitcoin-history");
        const result = await response.json();

        setData(result.history);
      } catch (error) {
        console.error("Error fetching Bitcoin data:", error);
      }
    };

    fetchBitcoinData();
  }, []);

  // Componente de Tooltip personalizado
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { date, price, change } = payload[0].payload;
      return (
        <div className="tooltip">
          <p><strong>{date}</strong></p>
          <p>💰 Precio: ${price} USD</p>
          <p>📉 Cambio: {change}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <h1 className="title">Bitcoin Price Last 30 Days</h1>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="price" stroke="#f7931a" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <style>
        {`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: rgb(46, 46, 46);
            padding: 20px;
          }

          .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: white;
          }

          .chart-container {
            width: 100%;
            max-width: 800px;
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          }

          .tooltip {
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px;
            border-radius: 5px;
            font-size: 14px;
            text-align: left;
          }
        `}
      </style>
    </div>
  );
};

export default App;
