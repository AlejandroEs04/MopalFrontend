import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { socket } from './socket.js'
import { AppProvider } from "./context/AppProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import './styles.css'
import MainLayout from "./layout/MainLayout.jsx";
import InventoryLayout from "./layout/InventoryLayout.jsx";
import Index from "./pages/Index.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductPage from "./pages/ProductoPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import ContactoPage from "./pages/ContactoPage.jsx";
import NosotrosPage from "./pages/NosotrosPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProductListPage from "./pages/ProductListPage.jsx";
import InventoryHistoryPage from "./pages/InventoryHistoryPage.jsx";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    socket.on('connect', onConnect);

    return () => {
      socket.off('connect', onConnect)
    }
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="productos" element={<ProductsPage />} />
              <Route path="productos/:folio" element={<ProductPage />} />
              <Route path="contacto" element={<ContactoPage />} />
              <Route path="nosotros" element={<NosotrosPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>

            <Route path="/inventory" element={<InventoryLayout />}>
              <Route index element={<InventoryPage />} />
              <Route path="products-list" element={<ProductListPage />} />
              <Route path="history" element={<InventoryHistoryPage />} />
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
