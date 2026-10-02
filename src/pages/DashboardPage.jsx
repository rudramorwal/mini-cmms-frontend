import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/client';
import toast from 'react-hot-toast';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="page-container">Loading...</div>;
  if (!stats) return <div className="page-container">No stats available</div>;

  // Calculate average MTTR across all machines
  const avgMttr = stats.mttr_by_machine && stats.mttr_by_machine.length > 0
    ? (stats.mttr_by_machine.reduce((sum, m) => sum + m.mttr_hours, 0) / stats.mttr_by_machine.length).toFixed(1)
    : '0.0';

  return (
    <div className="page-container dashboard-page">
      <h1>Dashboard</h1>
      
      <div className="stats-cards">
        <div className="stat-card stat-card-warning">
          <div className="stat-value">{stats.open_work_orders}</div>
          <div className="stat-label">Open Work Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.total_work_orders}</div>
          <div className="stat-label">Total Work Orders</div>
        </div>
        <div className="stat-card stat-card-info">
          <div className="stat-value">{avgMttr} hrs</div>
          <div className="stat-label">Avg MTTR</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section section-worst">
          <h2>🔴 Worst 5 Machines (Highest MTTR)</h2>
          <table className="data-table worst-machines">
            <thead>
              <tr>
                <th>#</th>
                <th>Machine</th>
                <th>MTTR (hrs)</th>
                <th>Repair Count</th>
              </tr>
            </thead>
            <tbody>
              {(stats.worst_5_machines || []).map((m, idx) => (
                <tr key={m.machine_id}>
                  <td>{idx + 1}</td>
                  <td>{m.machine_name}</td>
                  <td className="mttr-value">{m.mttr_hours.toFixed(1)}</td>
                  <td>{m.repair_count}</td>
                </tr>
              ))}
              {(!stats.worst_5_machines || stats.worst_5_machines.length === 0) && (
                <tr><td colSpan="4">No data — close some tickets first</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="dashboard-section section-all">
          <h2>📊 MTTR by Machine</h2>
          <table className="data-table all-machines">
            <thead>
              <tr>
                <th>Machine</th>
                <th>MTTR (hrs)</th>
                <th>Repairs</th>
              </tr>
            </thead>
            <tbody>
              {(stats.mttr_by_machine || []).map(m => (
                <tr key={m.machine_id}>
                  <td>{m.machine_name}</td>
                  <td>{m.mttr_hours.toFixed(1)}</td>
                  <td>{m.repair_count}</td>
                </tr>
              ))}
              {(!stats.mttr_by_machine || stats.mttr_by_machine.length === 0) && (
                <tr><td colSpan="3">No data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
