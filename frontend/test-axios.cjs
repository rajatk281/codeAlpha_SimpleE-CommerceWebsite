const axios = require('axios');

const api = axios.create({
  baseURL: 'https://codealpha-simplee-commercewebsite.onrender.com/api',
});

api.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/')) {
    config.url = config.url.substring(1);
  }
  if (config.baseURL && !config.baseURL.endsWith('/')) {
    config.baseURL += '/';
  }
  return config;
});

async function run() {
  try {
    const res = await api.get('/products/featured?limit=8');
    console.log('Success!', res.status);
  } catch (e) {
    console.log('Axios resolved URL:', e.config?.url);
    console.log('Axios baseURL:', e.config?.baseURL);
    console.log('Error status:', e.response?.status);
  }
}
run();
