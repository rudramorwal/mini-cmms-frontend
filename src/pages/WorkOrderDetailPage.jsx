import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getWorkOrder, transitionWorkOrder, getTechnicians } from '../api/client';
import CommentThread from '../components/CommentThread';
import toast from 'react-hot-toast';

function TransitionButtons({ workOrder, onRefresh }) {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [technicians, setTechnicians] = useState([]);
  const [assignData, setAssignData] = useState({ technician_id: '', comment: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showAssignForm) {
      getTechnicians().then(setTechnicians).catch(() => toast.error('Failed to load technicians'));
    }
  }, [showAssignForm]);

  const handleTransition = async (new_status, extraData = {}) => {
    setLoading(true);
    try {
      await transitionWorkOrder(workOrder.id, { new_status, ...extraData });
      toast.success(`Work order transitioned to ${new_status}`);
      setShowAssignForm(false);
      onRefresh();
    } catch (error) {
      const msg = error.response?.data?.detail || 'Failed to update work order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (workOrder.status === 'open') {
    if (showAssignForm) {
      return (
        <div className="transition-form">
          <select 
            value={assignData.technician_id} 
            onChange={e => setAssignData({...assignData, technician_id: e.target.value})}
          >
            <option value="">Select Technician</option>
            {technicians.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Optional comment"
            value={assignData.comment}
            onChange={e => setAssignData({...assignData, comment: e.target.value})}
          />
          <button 
            className="btn btn-primary"
            onClick={() => handleTransition('assigned', { 
              technician_id: parseInt(assignData.technician_id), 
              comment: assignData.comment || undefined 
            })}
            disabled={!assignData.technician_id || loading}
          >
            Confirm
          </button>
          <button className="btn btn-secondary" onClick={() => setShowAssignForm(false)}>
            Cancel
          </button>
        </div>
      );
    }
    return (
      <button className="btn btn-primary" onClick={() => setShowAssignForm(true)}>
        Assign Technician
      </button>
    );
  }

  if (workOrder.status === 'assigned') {
    return (
      <button 
        className="btn btn-primary" 
        onClick={() => handleTransition('in_progress')}
        disabled={loading}
      >
        Start Work
      </button>
    );
  }

  if (workOrder.status === 'in_progress') {
    return (
      <button 
        className="btn btn-success" 
        onClick={() => handleTransition('closed')}
        disabled={loading}
      >
        Mark Closed
      </button>
    );
  }

  return null;
}

function WorkOrderDetailPage() {
  const { id } = useParams();
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getWorkOrder(id);
      setWorkOrder(data);
    } catch (error) {
      toast.error('Failed to load work order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (loading) return <div className="page-container">Loading...</div>;
  if (!workOrder) return <div className="page-container">Work Order not found</div>;

  return (
    <div className="page-container detail-page">
      <div className="detail-header">
        <div className="title-row">
          <h1>{workOrder.title}</h1>
          <div className="badges">
            <span className={`badge badge-status-${workOrder.status}`}>{workOrder.status}</span>
            <span className={`badge badge-${workOrder.priority.toLowerCase()}`}>{workOrder.priority}</span>
          </div>
        </div>
        <div className="meta-info">
          <p><strong>Machine:</strong> {workOrder.machine_name}</p>
          <p><strong>Technician:</strong> {workOrder.technician_name || 'Unassigned'}</p>
          <p><strong>Opened At:</strong> {new Date(workOrder.opened_at).toLocaleString()}</p>
          {workOrder.closed_at && (
            <p><strong>Closed At:</strong> {new Date(workOrder.closed_at).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="detail-section">
        <h3>Description</h3>
        <p className="description-text">{workOrder.description || 'No description provided.'}</p>
      </div>

      <div className="detail-section actions-section">
        <TransitionButtons workOrder={workOrder} onRefresh={fetchDetails} />
      </div>

      <div className="detail-section">
        <h3>Comments</h3>
        <CommentThread workOrderId={id} />
      </div>
    </div>
  );
}

export default WorkOrderDetailPage;
