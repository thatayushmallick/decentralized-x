# 🛡️ Decentralized-X

A decentralized social media application built on Ethereum that combats misinformation using blockchain verification, IPFS content storage, a reputation-based validator network, and community-driven consensus.

---

## 📌 Overview

This project demonstrates how decentralized technologies can be harnessed to tackle misinformation at its roots by:

- Verifying media originality and provenance via IPFS + smart contracts
- Empowering a reputation-based consensus system to validate reported content
- Providing transparency, traceability, and community governance for social media

---

## 🔧 Prerequisites

- Node.js (v16 or later)
- NPM
- Metamask wallet (connected to Sepolia Testnet)

---

## 📁 Project Structure

- `PostContract.sol`: Handles post creation, hash lookup, user registration, and engagement (likes/dislikes).
- `Misinformation.sol`: Manages report mechanisms, validator consensus, and on-chain reputation updates.
- `frontend/`: Contains the React.js frontend for interacting with the blockchain and IPFS.

---

## 🔐 Smart Contract Details

### 📝 PostContract.sol

Manages:

- User registration/login
- Post creation with IPFS hash
- Original/sourced detection
- Likes/dislikes

### 🚨 Misinformation.sol

Manages:

- Reporting & flagging logic
- Validator-based voting system
- On-chain reputation for validators/reporters
- Reward/penalty via consensus

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/decentralized-social-media.git
cd decentralized-social-media
```

### 2. Install Dependencies

Run the command :

```bash
npm install
```

### 3. Configure Metamask wallet

- Ensure your Metamask is connected to Sepolia with test ETH
- Test ETH can be obtained from sources like https://cloud.google.com/application/web3/faucet

### 4. Compile Smart Contracts (Optional)

- Upload the smart contracts `PostContract.sol` and `Misinformation.sol` on Remix IDE.
- Compile the smart contract `Misinformation.sol`.
- Set environment as Sepolia Testnet on Remix IDE.
- Deploy the smart contract.
- Copy the contract ABI and contract address and paste them in `frontend/src/contract.js`.

### 5. Start Development Server

Run the command :

```bash
npm start
```

#### Open http://localhost:3000 in your browser.

Note : Ensure your Metamask is connected to Sepolia with test ETH.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and open a pull request. Feel free to open issues for bugs, ideas, or suggestions.

---

## 🧠 Authors

Built by :

- Ayush Mallick

- Ameya Langer

- Pratyush Kaurav

as part of an academic course project.

---
