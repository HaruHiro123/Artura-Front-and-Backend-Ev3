import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import ArturaDataProvider from './context/ArturaDataProvider.jsx'
import CartProvider from './context/CartProvider.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { AuthProvider } from './utils/AuthContext.jsx'
import { ProductProvider } from './utils/ProductContext.jsx'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProductProvider>
            <LanguageProvider>
              <ArturaDataProvider>
                <CartProvider>
                  <App />
                  <Toaster
                    position="top-right"
                    reverseOrder={false}
                    toastOptions={{
                      duration: 6000,
                      style: {
                        borderRadius: '12px',
                        background: '#1c1917',
                        color: '#fff',
                        fontSize: '14px',
                      },
                    }}
                  />
                </CartProvider>
              </ArturaDataProvider>
            </LanguageProvider>
          </ProductProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)