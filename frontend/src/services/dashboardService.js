// src/services/dashboardService.js
import axios from "axios";
import { getTokenFromCookie } from "../services/authService";

const API_URL = "http://localhost:8080/farmtrade/api";

const getAuthHeaders = () => {
  const token = getTokenFromCookie();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const fetchDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/dashboard/stats`, getAuthHeaders());
  return response.data;
};

const getTopProducts = async () => {
  const response = await axios.get(`${API_URL}/dashboard/top-products`, getAuthHeaders());
  return response.data;
};

const getUsersByRole = async () => {
  const response = await axios.get(`${API_URL}/dashboard/users-by-role`, getAuthHeaders());
  return response.data;
};

const getNewUsersLastWeek = async () => {
  const response = await axios.get(`${API_URL}/dashboard/new-users`, getAuthHeaders());
  return response.data;
};

export {
  fetchDashboardStats,
  getTopProducts,
  getUsersByRole,
  getNewUsersLastWeek
};