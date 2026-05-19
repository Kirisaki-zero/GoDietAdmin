import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import Reports from './pages/Reports';
import Fitness from './pages/Fitness';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/fitness" element={<Fitness />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
