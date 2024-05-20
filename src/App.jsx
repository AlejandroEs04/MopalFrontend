import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { socket } from './socket.js'
import { AppProvider } from "./context/AppProvider.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import MainLayout from "./layout/MainLayout.jsx";
import Index from "./pages/Index.jsx";
import './styles.css'

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
            </Route>
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
