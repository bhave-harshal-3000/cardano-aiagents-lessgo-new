// Cardano Wallet Integration (Eternl, Nami, etc.)

declare global {
  interface Window {
    cardano?: {
      eternl?: any;
      nami?: any;
      flint?: any;
      [key: string]: any;
    };
  }
}

export interface WalletAPI {
  getNetworkId(): Promise<number>;
  getUtxos(): Promise<string[]>;
  getBalance(): Promise<string>;
  getUsedAddresses(): Promise<string[]>;
  getUnusedAddresses(): Promise<string[]>;
  getChangeAddress(): Promise<string>;
  getRewardAddresses(): Promise<string[]>;
  signTx(tx: string, partialSign: boolean): Promise<string>;
  signData(address: string, payload: string): Promise<{ signature: string; key: string }>;
  submitTx(tx: string): Promise<string>;
}

export const connectEternlWallet = async (): Promise<{ address: string; api: WalletAPI } | null> => {
  try {
    // Check if Eternl wallet is installed
    if (!window.cardano?.eternl) {
      alert('Eternl Wallet is not installed. Please install it from https://eternl.io/');
      return null;
    }

    // Enable the wallet
    const api: WalletAPI = await window.cardano.eternl.enable();
    
    // Get wallet address
    const usedAddresses = await api.getUsedAddresses();
    const unusedAddresses = await api.getUnusedAddresses();
    
    let addressHex = '';
    if (usedAddresses.length > 0) {
      addressHex = usedAddresses[0];
    } else if (unusedAddresses.length > 0) {
      addressHex = unusedAddresses[0];
    } else {
      throw new Error('No addresses found in wallet');
    }

    // Convert hex address to bech32 format
    const address = hexToBech32(addressHex);
    
    return { address, api };
  } catch (error) {
    console.error('Failed to connect Eternl wallet:', error);
    alert('Failed to connect wallet. Please try again.');
    return null;
  }
};

// Try to connect to any available Cardano wallet
export const connectAnyWallet = async (): Promise<{ address: string; api: WalletAPI; walletName: string } | null> => {
  try {
    if (!window.cardano) {
      alert('No Cardano wallet detected. Please install Eternl, Nami, or another Cardano wallet.');
      return null;
    }

    // Priority order: Eternl, Nami, Flint, others
    const wallets = ['eternl', 'nami', 'flint'];
    
    for (const walletName of wallets) {
      if (window.cardano[walletName]) {
        try {
          const api: WalletAPI = await window.cardano[walletName].enable();
          const usedAddresses = await api.getUsedAddresses();
          const unusedAddresses = await api.getUnusedAddresses();
          
          let addressHex = '';
          if (usedAddresses.length > 0) {
            addressHex = usedAddresses[0];
          } else if (unusedAddresses.length > 0) {
            addressHex = unusedAddresses[0];
          }

          const address = hexToBech32(addressHex);
          return { address, api, walletName };
        } catch (error) {
          console.log(`Failed to connect ${walletName}, trying next...`);
          continue;
        }
      }
    }

    // If no priority wallet found, try any available wallet
    const availableWallets = Object.keys(window.cardano);
    for (const walletName of availableWallets) {
      if (window.cardano[walletName]?.enable) {
        try {
          const api: WalletAPI = await window.cardano[walletName].enable();
          const usedAddresses = await api.getUsedAddresses();
          const unusedAddresses = await api.getUnusedAddresses();
          
          let addressHex = '';
          if (usedAddresses.length > 0) {
            addressHex = usedAddresses[0];
          } else if (unusedAddresses.length > 0) {
            addressHex = unusedAddresses[0];
          }

          const address = hexToBech32(addressHex);
          return { address, api, walletName };
        } catch (error) {
          continue;
        }
      }
    }

    alert('Failed to connect to any wallet. Please make sure your wallet is unlocked.');
    return null;
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    alert('Failed to connect wallet. Please try again.');
    return null;
  }
};

// Helper function to convert hex address to bech32 format
function hexToBech32(hex: string): string {
  try {
    // For simplicity, return the hex address
    // In production, use @emurgo/cardano-serialization-lib-browser for proper conversion
    return hex;
  } catch (error) {
    console.error('Failed to convert address:', error);
    return hex;
  }
}

// Get network name
export const getNetworkName = (networkId: number): string => {
  switch (networkId) {
    case 0:
      return 'Testnet';
    case 1:
      return 'Mainnet';
    default:
      return 'Unknown';
  }
};
