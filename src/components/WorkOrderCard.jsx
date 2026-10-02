import React from 'react';
import { useNavigate } from 'react-router-dom';

function WorkOrderCard({ workOrder }) {
  const navigate = useNavigate();

  const getTimeSince = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay > 0) return `${diffDay}d ago`;
    if (diffHr > 0) return `${diffHr}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return 'just now';
  };

  const priorityClass = `priority-${workOrder.priority.toLowerCase()}`;

  return (
    <div 
      className={`work-order-card ${priorityClass}`} 
      onClick={() => navigate(`/work-orders/${workOrder.id}`)}
    >
      <div className="card-header">
        <strong className="card-title">{workOrder.title}</strong>
      </div>
      <div className="card-body">
        <div className="card-machine">{workOrder.machine_name}</div>
        {workOrder.technician_name && (
          <div className="card-technician">Tech: {workOrder.technician_name}</div>
        )}
      </div>
      <div className="card-footer">
        <span className={`badge badge-${workOrder.priority.toLowerCase()}`}>
          {workOrder.priority}
        </span>
        <span className="card-time">{getTimeSince(workOrder.opened_at)}</span>
      </div>
    </div>
  );
}

export default WorkOrderCard;
