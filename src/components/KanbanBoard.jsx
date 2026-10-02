import React from 'react';
import WorkOrderCard from './WorkOrderCard';

function KanbanBoard({ workOrders }) {
  const columns = [
    { id: 'open', title: '🟡 Open', items: workOrders.open },
    { id: 'assigned', title: '🔵 Assigned', items: workOrders.assigned },
    { id: 'in_progress', title: '🟠 In Progress', items: workOrders.in_progress },
    { id: 'closed', title: '🟢 Closed', items: workOrders.closed },
  ];

  return (
    <div className="kanban-board">
      {columns.map(column => (
        <div key={column.id} className="kanban-column">
          <div className="kanban-column-header">
            <h3>{column.title}</h3>
            <span className="kanban-column-count">{column.items.length}</span>
          </div>
          <div className="kanban-column-content">
            {column.items.map(wo => (
              <WorkOrderCard key={wo.id} workOrder={wo} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
