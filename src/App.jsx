import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import Web3 from "web3";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Initialize Apollo Client for The Graph
const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
  cache: new InMemoryCache(),
});

// Aave contract ABI (simplified for this example)
const aaveABI = [
  {
    constant: true,
    inputs: [{ name: "user", type: "address" }],
    name: "getUserAccountData",
    outputs: [
      { name: "totalCollateralETH", type: "uint256" },
      { name: "totalDebtETH", type: "uint256" },
      { name: "availableBorrowsETH", type: "uint256" },
      { name: "currentLiquidationThreshold", type: "uint256" },
      { name: "ltv", type: "uint256" },
      { name: "healthFactor", type: "uint256" },
    ],
    type: "function",
  },
];

// Sample historical data
const sampleHistoricalData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Portfolio Value (USD)",
      data: [1000, 1200, 1100, 1300, 1400, 1350, 1500],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

function App() {
  const [address, setAddress] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

  const web3 = new Web3(window.ethereum);

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      setAddress(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const fetchPortfolioData = async () => {
    if (!address) return;

    setLoading(true);

    try {
      // Simulate fetching data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Sample data (replace this with actual API calls in a real application)
      const sampleData = {
        uniswap: [
          {
            pair: { token0: { symbol: "ETH" }, token1: { symbol: "USDC" } },
            liquidityTokenBalance: "10.5",
            reserveUSD: "2000",
          },
          {
            pair: { token0: { symbol: "WBTC" }, token1: { symbol: "ETH" } },
            liquidityTokenBalance: "0.5",
            reserveUSD: "1500",
          },
        ],
        aave: {
          totalCollateralETH: "5.0",
          totalDebtETH: "2.0",
          availableBorrowsETH: "3.0",
          healthFactor: "1.5",
        },
      };

      setPortfolio(sampleData);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchPortfolioData();
    }
  }, [address]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold mb-6 text-center">
              DeFi Portfolio Tracker
            </h1>
            {!address ? (
              <button
                onClick={connectWallet}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Connect Wallet
              </button>
            ) : (
              <div>
                <p className="mb-4 text-center">
                  Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <button
                  onClick={fetchPortfolioData}
                  className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Refresh Portfolio
                </button>
                {loading ? (
                  <p className="mt-4 text-center">Loading portfolio data...</p>
                ) : portfolio ? (
                  <div className="mt-6">
                    <h2 className="text-xl font-bold mb-2">
                      Uniswap Positions
                    </h2>
                    {portfolio.uniswap.map((position, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 bg-gray-100 rounded-lg"
                      >
                        <p className="font-semibold">
                          {position.pair.token0.symbol}/
                          {position.pair.token1.symbol}
                        </p>
                        <p>Balance: {position.liquidityTokenBalance}</p>
                        <p>
                          Value: ${parseFloat(position.reserveUSD).toFixed(2)}
                        </p>
                      </div>
                    ))}
                    <h2 className="text-xl font-bold mt-6 mb-2">
                      Aave Position
                    </h2>
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <p>
                        Total Collateral:{" "}
                        {parseFloat(portfolio.aave.totalCollateralETH).toFixed(
                          4
                        )}{" "}
                        ETH
                      </p>
                      <p>
                        Total Debt:{" "}
                        {parseFloat(portfolio.aave.totalDebtETH).toFixed(4)} ETH
                      </p>
                      <p>
                        Available to Borrow:{" "}
                        {parseFloat(portfolio.aave.availableBorrowsETH).toFixed(
                          4
                        )}{" "}
                        ETH
                      </p>
                      <p>
                        Health Factor:{" "}
                        {parseFloat(portfolio.aave.healthFactor).toFixed(2)}
                      </p>
                    </div>
                    <h2 className="text-xl font-bold mt-6 mb-2">
                      Historical Performance
                    </h2>
                    <div className="mt-4" style={{ height: "300px" }}>
                      <Line
                        data={sampleHistoricalData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: "top",
                            },
                            title: {
                              display: true,
                              text: "Portfolio Value Over Time",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
