import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectAnyWallet } from '../utils/wallet';
import type { WalletAPI } from '../utils/wallet';
import { userAPI } from '../services/api';

interface WalletContextType {
  walletAddress: string | null;
  walletApi: WalletAPI | null;
  walletName: string | null;
  userId: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletApi, setWalletApi] = useState<WalletAPI | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Load wallet from localStorage on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem('walletAddress');
    const savedUserId = localStorage.getItem('userId');
    const savedWalletName = localStorage.getItem('walletName');
    
    if (savedAddress && savedUserId) {
      setWalletAddress(savedAddress);
      setUserId(savedUserId);
      setWalletName(savedWalletName);
    }
  }, []);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Connect to wallet
      const walletData = await connectAnyWallet();
      
      if (!walletData) {
        setIsConnecting(false);
        return;
      }

      const { address, api, walletName: name } = walletData;
      
      // Save or get user from database
      const user = await userAPI.createOrGet({ walletAddress: address });
      
      // Update state
      setWalletAddress(address);
      setWalletApi(api);
      setWalletName(name);
      setUserId(user._id);
      
      // Save to localStorage
      localStorage.setItem('walletAddress', address);
      localStorage.setItem('userId', user._id);
      localStorage.setItem('walletName', name);
      
      console.log('Wallet connected successfully:', {
        address,
        walletName: name,
        userId: user._id,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletApi(null);
    setWalletName(null);
    setUserId(null);
    
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('userId');
    localStorage.removeItem('walletName');
    
    console.log('Wallet disconnected');
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        walletApi,
        walletName,
        userId,
        isConnecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
