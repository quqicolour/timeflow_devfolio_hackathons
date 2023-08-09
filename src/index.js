import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//钱包插件
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createClient, WagmiConfig } from 'wagmi';
import { configureChains } from '@wagmi/core';
import { polygonMumbai,polygon,arbitrum,optimism } from '@wagmi/core/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

//钱包连接插件全局变量
const { chains, provider } = configureChains(
  [polygonMumbai,polygon,arbitrum,optimism],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_API }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'Ring Current Protocol',
  chains
});
const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
