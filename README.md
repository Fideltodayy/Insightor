# Insightor: DeFi Portfolio Tracker

## Table of Contents

1. [Introduction](#introduction)
2. [Problem Statement](#problem-statement)
3. [Our Solution](#our-solution)
4. [Key Features](#key-features)
5. [Technology Stack](#technology-stack)
6. [System Architecture](#system-architecture)
7. [Setup Instructions](#setup-instructions)
8. [Usage Guide](#usage-guide)
9. [Future Enhancements](#future-enhancements)
10. [Contributing](#contributing)
11. [License](#license)

## Introduction

**Insightor** is a comprehensive DeFi portfolio tracking application designed to provide users with a clear, consolidated view of their decentralized finance investments across multiple protocols. In the rapidly evolving world of DeFi, managing investments across various platforms can be challenging and time-consuming. **Insightor** aims to simplify this process, offering users valuable insights into their DeFi portfolio performance.

## Problem Statement

As DeFi continues to grow, users often find themselves interacting with multiple protocols such as Uniswap, Aave, and others. Each protocol has its own interface and way of presenting data, making it difficult for users to:

1. Get a holistic view of their DeFi investments
2. Track performance across different protocols
3. Understand their risk exposure
4. Identify new opportunities within their portfolio

This fragmentation can lead to inefficient decision-making and potentially missed opportunities or overlooked risks.

## Our Solution

**Insightor** addresses these challenges by providing a unified dashboard that aggregates data from various DeFi protocols. Our application offers:

1. A consolidated view of investments across multiple DeFi protocols
2. Real-time data fetching and visualization
3. Historical performance tracking
4. Risk assessment tools
5. Intuitive and user-friendly interface

By bringing all this information together, **Insightor** empowers users to make more informed decisions about their DeFi investments.

## Key Features

- **Multi-protocol Support**: Currently integrating Uniswap and Aave, with plans to add more protocols in the future.
- **Real-time Data**: Utilizes The Graph Protocol to fetch up-to-date information from the blockchain.
- **Portfolio Visualization**: Interactive charts and graphs to represent asset allocation, historical performance, and protocol-specific metrics.
- **Wallet Integration**: Seamless connection with user wallets for automatic data retrieval.
- **Performance Tracking**: Historical data visualization to track portfolio growth over time.
- **Risk Assessment**: Provides key risk indicators such as the health factor for lending positions.

## Technology Stack

- **Frontend**: React.js
- **Blockchain Interaction**: Web3.js
- **Data Fetching**: The Graph Protocol (GraphQL)
- **Charting**: Chart.js
- **Styling**: Tailwind CSS

## System Architecture

**Insightor's** architecture is designed to efficiently fetch and display DeFi data:

1. **Frontend (React.js)**:

   - Provides the user interface and manages application state.
   - Integrates with Web3.js for wallet connections.
   - Uses Apollo Client to query The Graph Protocol.

2. **The Graph Protocol**:

   - Indexes blockchain data for efficient querying.
   - We use the Uniswap V2 subgraph to fetch detailed information about user's liquidity positions.
   - Allows for complex data retrieval with a single GraphQL query, reducing load times and improving user experience.

3. **Web3.js**:

   - Facilitates direct interaction with the Ethereum blockchain.
   - Used for connecting user wallets and fetching data from smart contracts (e.g., Aave lending positions).

4. **Smart Contract Interaction**:
   - Direct calls to protocol contracts (e.g., Aave) for data not available through The Graph.

This architecture allows **Insightor** to provide real-time, accurate data while maintaining a responsive user interface.

## Setup Instructions

To set up **Insightor** locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/insightor.git
   cd insightor
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the root directory and add any necessary environment variables (e.g., API keys).
4. Start the development server:
   ```bash
   npm start
   ```
5. Open your browser and navigate to http://localhost:3000

## Usage Guide

1. **Connect Wallet**:

   - Click the "Connect Wallet" button on the homepage.
   - Approve the connection request in your Web3 wallet (e.g., MetaMask).

2. **View Portfolio Overview**:

   - Once connected, you'll see your total portfolio value and asset allocation.

3. **Explore Protocol-Specific Data**:

   - Scroll down to view detailed information about your Uniswap and Aave positions.

4. **Analyze Historical Performance**:

   - Check the historical performance chart to track your portfolio's growth over time.

5. **Refresh Data**:
   - Click the "Refresh Portfolio" button to fetch the latest data from the blockchain.

## Future Enhancements

1. Integration with additional DeFi protocols (e.g., Compound, Curve Finance).
2. Advanced analytics and yield optimization suggestions.
3. Mobile application for on-the-go portfolio management.
4. Alerts and notifications for important portfolio events.
5. Multi-chain support for a more comprehensive DeFi experience.

## Contributing

We welcome contributions to **Insightor**! If you have suggestions for improvements or bug fixes, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature'
   ```
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

**Insightor** is more than just a portfolio tracker; it's a window into your decentralized financial world. By bridging the gap between complex DeFi protocols and user-friendly interfaces, we're taking a step towards a more accessible and transparent financial future.
