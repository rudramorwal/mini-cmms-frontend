import React, { useState, useEffect } from 'react';
import { getWorkOrders } from '../api/client';
import KanbanBoard from '../components/KanbanBoard';
import ReportBreakdownModal from '../components/ReportBreakdownModal';

function KanbanPage() {
  const [workOrders, setWorkOrders] = useState({
    open: [],
    assigned: [],
    in_progress: [],
    closed: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      const response = await getWorkOrders();
      const data = response.work_orders || [];
      
      const priorityOrder = { 'critical': 1, 'high': 2, 'low': 3 };
      
      const sortFunction = (a, b) => {
        const pa = priorityOrder[a.priority] || 99;
        const pb = priorityOrder[b.priority] || 99;
        if (pa !== pb) return pa - pb;
        return new Date(a.opened_at) - new Date(b.opened_at);
      };

      const grouped = {
        open: data.filter(wo => wo.status === 'open').sort(sortFunction),
        assigned: data.filter(wo => wo.status === 'assigned').sort(sortFunction),
        in_progress: data.filter(wo => wo.status === 'in_progress').sort(sortFunction),
        closed: data.filter(wo => wo.status === 'closed').sort(sortFunction),
      };
      
      setWorkOrders(grouped);
    } catch (error) {
      console.error('Failed to fetch work orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  return (
    <div className="page-container kanban-page">
      <div className="page-header">
        <h1>Work Orders</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          + Report Breakdown
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <KanbanBoard workOrders={workOrders} />
      )}

      {isModalOpen && (
        <ReportBreakdownModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchWorkOrders();
          }} 
        />
      )}
    </div>
  );
}

export default KanbanPage;
