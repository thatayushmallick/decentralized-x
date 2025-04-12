// src/context/WalletContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import { contractABI, contractAddress } from "../contract";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    if (account && contract && signer) {
      return { contractInstance: contract, userAddress: account };
    }

    if (!window.ethereum) {
      alert("🦊 Please install MetaMask!");
      return null;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contractInstance = new Contract(contractAddress, contractABI, signer);

      setAccount(userAddress);
      setSigner(signer);
      setContract(contractInstance);

      return { contractInstance, userAddress };
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("❌ Wallet connection failed.");
      return null;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const provider = new BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();
          const contractInstance = new Contract(contractAddress, contractABI, signer);

          setAccount(userAddress);
          setSigner(signer);
          setContract(contractInstance);

          console.log("🆕 Account switched to:", userAddress);
        } else {
          // User disconnected wallet
          setAccount(null);
          setSigner(null);
          setContract(null);
          console.log("⚠️ Wallet disconnected");
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ account, contract, signer, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
