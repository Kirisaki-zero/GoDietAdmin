import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Reports from './pages/Reports';
import Fitness from './pages/Fitness';
import Foods from './pages/Foods';
import Login from './pages/Login';
import './App.css';

// Guard: cek apakah admin sudah login
function RequireAdmin({ children }: { children: React.ReactNode }) {
  const adminId = localStorage.getItem('admin_id');
  if (!adminId) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Login — tanpa Sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Semua halaman admin — dilindungi RequireAdmin */}
        <Route
          path="/*"
          element={
            <RequireAdmin>
              <div className="app-layout">
                <Sidebar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Navigate to="/overview" replace />} />
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/fitness" element={<Fitness />} />
                    <Route path="/foods" element={<Foods />} />
                  </Routes>
                </main>
              </div>
            </RequireAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
