import axios from 'axios';

const BASE_URL = 'http://localhost:3000'; // Replace with your backend URL when hosted

// Register user
export const registerUser = async (name, email, password) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

// Login user
export const loginUser = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
    email,
  });
  return response.data;
};
