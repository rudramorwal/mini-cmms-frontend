import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import KanbanPage from './pages/KanbanPage';
import WorkOrderDetailPage from './pages/WorkOrderDetailPage';
import DashboardPage from './pages/DashboardPage';
import MachineHistoryPage from './pages/MachineHistoryPage';

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/">Mini CMMS</Link>
        </div>
        <div className="nav-links">
          <Link to="/">Board</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/machines">Machine History</Link>
        </div>
      </nav>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<KanbanPage />} />
          <Route path="/work-orders/:id" element={<WorkOrderDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/machines" element={<MachineHistoryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
