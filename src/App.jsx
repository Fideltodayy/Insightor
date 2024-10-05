import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import Web3 from "web3";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const UNISWAP_POSITIONS_QUERY = gql`
  query getUserPositions($userAddress: Bytes!) {
    user(id: $userAddress) {
      liquidityPositions {
        liquidityTokenBalance
        pair {
          token0 {
            symbol
          }
          token1 {
            symbol
          }
          reserveUSD
        }
      }
    }
  }
`;

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

function App() {
  const [address, setAddress] = useState("");
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [historicalData, setHistoricalData] = useState(null);

  const web3 = new Web3(window.ethereum);

  const {
    loading: uniswapLoading,
    error: uniswapError,
    data: uniswapData,
  } = useQuery(UNISWAP_POSITIONS_QUERY, {
    variables: { userAddress: address.toLowerCase() },
    skip: !address,
  });

  const connectWallet = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      setAddress(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const fetchAaveData = async () => {
    // ... (keep the existing fetchAaveData function)
  };

  const fetchHistoricalData = async () => {
    // Simulated historical data fetch
    const data = [
      { date: "2023-01-01", value: 10000 },
      { date: "2023-02-01", value: 12000 },
      { date: "2023-03-01", value: 11500 },
      { date: "2023-04-01", value: 13000 },
      { date: "2023-05-01", value: 14500 },
    ];
    setHistoricalData(data);
  };

  const fetchPortfolioData = async () => {
    if (!address) return;

    setLoading(true);

    try {
      const aaveData = await fetchAaveData();
      await fetchHistoricalData();

      const portfolioData = {
        uniswap: uniswapData?.user?.liquidityPositions || [],
        aave: aaveData,
      };

      const totalUniswapValue = portfolioData.uniswap.reduce(
        (sum, position) =>
          sum +
          parseFloat(position.liquidityTokenBalance) *
            parseFloat(position.pair.reserveUSD),
        0
      );
      const totalAaveValue =
        parseFloat(portfolioData.aave.totalCollateralETH) * 2000; // Assuming 1 ETH = $2000
      const total = totalUniswapValue + totalAaveValue;

      setTotalValue(total);
      setPortfolio(portfolioData);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address && !uniswapLoading && !uniswapError) {
      fetchPortfolioData();
    }
  }, [address, uniswapLoading, uniswapError, uniswapData]);

  const renderUniswapPositions = () => {
    if (!portfolio?.uniswap?.length) return null;

    const data = {
      labels: portfolio.uniswap.map(
        (position) =>
          `${position.pair.token0.symbol}/${position.pair.token1.symbol}`
      ),
      datasets: [
        {
          data: portfolio.uniswap.map(
            (position) =>
              parseFloat(position.liquidityTokenBalance) *
              parseFloat(position.pair.reserveUSD)
          ),
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
          ],
        },
      ],
    };

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Uniswap Positions</h2>
        <p className="mb-4">
          Your Uniswap liquidity positions are displayed below. This chart shows
          the distribution of your investments across different token pairs.
        </p>
        <div className="h-64 mb-6">
          <Doughnut
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "right",
                },
                title: {
                  display: true,
                  text: "Uniswap Liquidity Distribution",
                },
              },
            }}
          />
        </div>
        {portfolio.uniswap.map((position, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <p className="font-semibold">
              {position.pair.token0.symbol}/{position.pair.token1.symbol}
            </p>
            <p>
              Balance: {parseFloat(position.liquidityTokenBalance).toFixed(4)}
            </p>
            <p>
              Value: $
              {(
                parseFloat(position.liquidityTokenBalance) *
                parseFloat(position.pair.reserveUSD)
              ).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderAavePosition = () => {
    if (!portfolio?.aave) return null;

    const data = {
      labels: ["Collateral", "Debt", "Available to Borrow"],
      datasets: [
        {
          data: [
            parseFloat(portfolio.aave.totalCollateralETH),
            parseFloat(portfolio.aave.totalDebtETH),
            parseFloat(portfolio.aave.availableBorrowsETH),
          ],
          backgroundColor: [
            "rgba(75, 192, 192, 0.8)",
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
          ],
        },
      ],
    };

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Aave Position</h2>
        <p className="mb-4">
          Your Aave lending and borrowing activity is summarized below. This
          chart shows your collateral, debt, and available borrowing capacity.
        </p>
        <div className="h-64 mb-6">
          <Doughnut
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "right",
                },
                title: {
                  display: true,
                  text: "Aave Position Overview",
                },
              },
            }}
          />
        </div>
        <div className="p-4 bg-gray-100 rounded-lg mt-4">
          <p>
            Total Collateral:{" "}
            {parseFloat(portfolio.aave.totalCollateralETH).toFixed(4)} ETH
          </p>
          <p>
            Total Debt: {parseFloat(portfolio.aave.totalDebtETH).toFixed(4)} ETH
          </p>
          <p>
            Available to Borrow:{" "}
            {parseFloat(portfolio.aave.availableBorrowsETH).toFixed(4)} ETH
          </p>
          <p>
            Health Factor: {parseFloat(portfolio.aave.healthFactor).toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  const renderHistoricalPerformance = () => {
    if (!historicalData) return null;

    const data = {
      labels: historicalData.map((item) => item.date),
      datasets: [
        {
          label: "Portfolio Value",
          data: historicalData.map((item) => item.value),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Historical Performance</h2>
        <p className="mb-4">
          Track your portfolio's performance over time. This chart shows how
          your total portfolio value has changed.
        </p>
        <div className="h-64">
          <Line
            data={data}
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
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Value (USD)",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    );
  };

  const renderAssetAllocation = () => {
    if (!portfolio) return null;

    const uniswapValue = portfolio.uniswap.reduce(
      (sum, position) =>
        sum +
        parseFloat(position.liquidityTokenBalance) *
          parseFloat(position.pair.reserveUSD),
      0
    );
    const aaveValue = parseFloat(portfolio.aave.totalCollateralETH) * 2000; // Assuming 1 ETH = $2000

    const data = {
      labels: ["Uniswap", "Aave"],
      datasets: [
        {
          data: [uniswapValue, aaveValue],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
          ],
        },
      ],
    };

    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
        <p className="mb-4">
          This chart shows how your assets are distributed across different DeFi
          protocols.
        </p>
        <div className="h-64">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                title: {
                  display: true,
                  text: "Asset Allocation by Protocol",
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: "Value (USD)",
                  },
                },
              },
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Insightor: Your DeFi Portfolio Tracker
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              Insightor helps you manage your decentralized finance investments
              by providing a clear overview of your positions across multiple
              protocols.
            </p>
            {!address ? (
              <div>
                <p className="mb-4 text-center">
                  Connect your wallet to see your DeFi portfolio across Uniswap
                  and Aave.
                </p>
                <button
                  onClick={connectWallet}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-center">
                  Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <button
                  onClick={fetchPortfolioData}
                  className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 mb-4"
                >
                  Refresh Portfolio
                </button>
                {loading ? (
                  <p className="mt-4 text-center">Loading portfolio data...</p>
                ) : (
                  <div>
                    <div
                      className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6"
                      role="alert"
                    >
                      <p className="font-bold">Total Portfolio Value</p>
                      <p>${totalValue.toFixed(2)}</p>
                    </div>
                    {renderAssetAllocation()}
                    {renderUniswapPositions()}
                    {renderAavePosition()}
                    {renderHistoricalPerformance()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
