import React, { useState, useEffect } from 'react';
import { getMachines, getMachineHistory } from '../api/client';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function MachineHistoryPage() {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
        if (data.length > 0) {
          setSelectedMachine(data[0].id);
        }
      } catch (error) {
        toast.error('Failed to load machines');
      }
    };
    fetchMachines();
  }, []);

  useEffect(() => {
    if (!selectedMachine) return;
    
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getMachineHistory(selectedMachine, search);
        setHistory(data);
      } catch (error) {
        toast.error('Failed to load machine history');
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timer = setTimeout(() => {
      fetchHistory();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [selectedMachine, search]);

  const getDuration = (wo) => {
    if (wo.status !== 'closed' || !wo.closed_at) return '-';
    const opened = new Date(wo.opened_at);
    const closed = new Date(wo.closed_at);
    const diffHours = (closed - opened) / (1000 * 60 * 60);
    return `${diffHours.toFixed(1)} hrs`;
  };

  return (
    <div className="page-container history-page">
      <h1>Machine History</h1>
      
      <div className="history-controls">
        <div className="control-group">
          <label>Select Machine:</label>
          <select 
            value={selectedMachine} 
            onChange={e => setSelectedMachine(e.target.value)}
          >
            {machines.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group">
          <label>Search:</label>
          <input 
            type="text" 
            placeholder="Search by title/desc..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="history-table-container">
        {loading ? (
          <p>Loading history...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Opened</th>
                <th>Closed</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {history.map(wo => (
                <tr key={wo.id}>
                  <td>
                    <Link to={`/work-orders/${wo.id}`}>#{wo.id}</Link>
                  </td>
                  <td>{wo.title}</td>
                  <td>
                    <span className={`badge badge-${wo.priority.toLowerCase()}`}>{wo.priority}</span>
                  </td>
                  <td>
                    <span className={`badge badge-status-${wo.status}`}>{wo.status}</span>
                  </td>
                  <td>{wo.technician_name || '-'}</td>
                  <td>{new Date(wo.opened_at).toLocaleString()}</td>
                  <td>{wo.closed_at ? new Date(wo.closed_at).toLocaleString() : '-'}</td>
                  <td>{getDuration(wo)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">No history found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MachineHistoryPage;
