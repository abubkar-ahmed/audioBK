import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { HashRouter } from "react-router-dom";
import { ShowAuthStatusProvider } from './context/ShowAuthStatusProvider';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import { ProductsProvider } from './context/ProductsProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter >
      <ProductsProvider>
        <AuthProvider>
          <ShowAuthStatusProvider>
            <CartProvider>
              <App />
            </CartProvider> 
          </ShowAuthStatusProvider>
        </AuthProvider>
      </ProductsProvider>
    </HashRouter >
  </React.StrictMode>,
)

