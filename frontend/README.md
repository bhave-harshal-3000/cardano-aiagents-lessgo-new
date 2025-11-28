# FinanceAI - Cardano Finance dApp

A beautiful, fully animated AI-powered finance tracking application built with React, TypeScript, Framer Motion, and designed for Cardano blockchain integration.

## Features

### 🎨 Beautiful UI Design
- **Mature Color Palette**: Sophisticated dark theme with subtle colors (no gradients or childish elements)
- **Smooth Animations**: Motion graphics using Framer Motion for all interactions
- **Page Transitions**: Seamless navigation between routes
- **Responsive Design**: Works beautifully on all screen sizes

### 🤖 AI-Powered Features
- **Smart Budgeting**: AI agents analyze spending and suggest optimizations
- **Auto-Categorization**: Automatic transaction classification with confidence scores
- **Intelligent Insights**: Timeline of AI recommendations with explainability
- **Agent Marketplace**: Discover and enable free or premium AI agents

### ⛓️ Blockchain Integration
- **Cardano Wallet**: Connect Nami, Eternl, or Lace wallets
- **On-Chain Proofs**: Store budget snapshots and decisions on Cardano
- **Hydra L2 Support**: Fast, low-cost transactions via Hydra Layer 2
- **Blockchain Explorer**: View transaction hashes and on-chain data

## Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Framer Motion** - Production-ready motion library
- **React Router** - Client-side routing with transitions
- **Lucide React** - Beautiful, consistent icon set

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
