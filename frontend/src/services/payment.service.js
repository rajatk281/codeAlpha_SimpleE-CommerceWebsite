import api from './api';

const paymentAPI = {
  createOrder: (amount) => api.post('/payments/create-order', { amount }),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

export default paymentAPI;
