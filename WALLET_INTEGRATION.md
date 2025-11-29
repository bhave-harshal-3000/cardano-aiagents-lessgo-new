# Eternl Wallet Integration

The "Connect Wallet" button is now connected to Eternl (and other Cardano wallets).

## How it Works:

1. **Click "Connect Wallet"** button in the navbar
2. The app will try to connect to your Cardano wallet (priority: Eternl, Nami, Flint, or any other installed wallet)
3. Your wallet will prompt you to approve the connection
4. Once approved:
   - Your wallet address is saved to MongoDB
   - A user record is created/retrieved in the database
   - The wallet address is displayed in the navbar
   - Your userId is used for all transactions, budgets, and savings

## Database Storage:

When you connect your wallet, the following is saved:
- **Users Collection**: Stores wallet address and user settings
- **Transactions**: Linked to your userId
- **Budgets**: Linked to your userId  
- **Savings**: Linked to your userId

## Wallet Persistence:

The wallet connection persists across page refreshes using localStorage.

## To Test:

1. Install Eternl Wallet: https://eternl.io/
2. Create/unlock your wallet
3. Go to your app and click "Connect Wallet"
4. Approve the connection in Eternl
5. Your wallet address will appear in the navbar
6. Now all data (transactions, budgets, savings) will be tied to your wallet!

## Supported Wallets:

- ✅ Eternl (Primary)
- ✅ Nami
- ✅ Flint
- ✅ Any Cardano CIP-30 compatible wallet

## Technical Details:

- **Frontend**: `WalletContext.tsx` manages wallet state globally
- **Backend**: User model stores wallet addresses
- **Integration**: Uses Cardano CIP-30 standard wallet API
- **Security**: Wallet private keys never leave your browser/wallet extension
