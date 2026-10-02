import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_URL
});

export const getWorkOrders = async (params) => {
  const response = await client.get('/work-orders', { params });
  return response.data;
};

export const getWorkOrder = async (id) => {
  const response = await client.get(`/work-orders/${id}`);
  return response.data;
};

export const createWorkOrder = async (data) => {
  const response = await client.post('/work-orders', data);
  return response.data;
};

export const transitionWorkOrder = async (id, data) => {
  const response = await client.post(`/work-orders/${id}/transition`, data);
  return response.data;
};

export const getComments = async (workOrderId) => {
  const response = await client.get(`/work-orders/${workOrderId}/comments`);
  return response.data;
};

export const createComment = async (workOrderId, data) => {
  const response = await client.post(`/work-orders/${workOrderId}/comments`, data);
  return response.data;
};

export const getMachines = async () => {
  const response = await client.get('/machines');
  return response.data;
};

export const getMachineHistory = async (machineId, search) => {
  const response = await client.get(`/machines/${machineId}/history`, {
    params: { search }
  });
  return response.data;
};

export const getTechnicians = async () => {
  const response = await client.get('/technicians');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await client.get('/dashboard/');
  return response.data;
};

export default client;
