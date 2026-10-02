import React, { useState, useEffect } from 'react';
import { getMachines, createWorkOrder } from '../api/client';
import toast from 'react-hot-toast';

function ReportBreakdownModal({ onClose, onSuccess }) {
  const [machines, setMachines] = useState([]);
  const [formData, setFormData] = useState({
    machine_id: '',
    title: '',
    description: '',
    priority: 'low'
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const data = await getMachines();
        setMachines(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, machine_id: data[0].id }));
        }
      } catch (error) {
        toast.error('Failed to load machines');
      }
    };
    fetchMachines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.machine_id || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    try {
      await createWorkOrder({
        ...formData,
        machine_id: parseInt(formData.machine_id),
        description: formData.description || 'No description provided'
      });
      toast.success('Breakdown reported successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to report breakdown');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Report Breakdown</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Machine *</label>
            <select 
              name="machine_id" 
              value={formData.machine_id} 
              onChange={handleChange}
              required
            >
              {machines.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange}
              placeholder="E.g., Motor overheating"
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Describe the issue..."
              rows="3"
            />
          </div>
          
          <div className="form-group priority-group">
            <label>Priority</label>
            <div className="radio-group">
              {[{value: 'critical', label: '🔴 Critical'}, {value: 'high', label: '🟡 High'}, {value: 'low', label: '🟢 Low'}].map(p => (
                <label key={p.value} className="radio-label">
                  <input 
                    type="radio" 
                    name="priority" 
                    value={p.value} 
                    checked={formData.priority === p.value}
                    onChange={handleChange}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportBreakdownModal;
