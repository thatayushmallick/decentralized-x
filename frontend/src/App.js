import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from './components/WalletContext';
import Register from './components/Register'
import Dashboard from './components/Dashboard';

function App() {
  return (
<WalletProvider>

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</BrowserRouter>
</WalletProvider>
  );
}

export default App;
