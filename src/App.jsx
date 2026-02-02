import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Home from './pages/Home';
import Login from './pages/admin/Login';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Secret admin route - access via Ctrl+Shift+A */}
            <Route path="/ysr-x7k9" element={<Login />} />
          </Routes>
        </Router>
      </AdminProvider>
    </AuthProvider>
  )
}

export default App
