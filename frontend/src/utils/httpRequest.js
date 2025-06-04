import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:8080/farmtrade',
   headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default request;
