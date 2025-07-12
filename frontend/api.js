/* api.js: funciones para comunicarse con el backend Django */

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000/api';

// Almacenar y recuperar tokens en localStorage
const setTokens = ({ access, refresh }) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Cabeceras con token si existe
const authHeaders = () => {
  const token = getAccessToken();
  return token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };
};

// 1. Login (obtener access y refresh)
export const loginUser = async (username, password) => {
  const resp = await fetch(`${BASE_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('Error en login');
  const data = await resp.json();
  setTokens(data);
  return data;
};

// 2. Refresh de access
export const refreshToken = async () => {
  const refresh = getRefreshToken();
  const resp = await fetch(`${BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('Error al refrescar token');
  const data = await resp.json();
  localStorage.setItem('access_token', data.access);
  return data;
};

// 3. Obtener notas (ejemplo de endpoint protegido)
export const getNotes = async () => {
  // intentar con el access token
  let headers = authHeaders();
  let resp = await fetch(`${BASE_URL}/notes/`, { headers });

  // si expira, refrescar y reintentar
  if (resp.status === 401) {
    await refreshToken();
    headers = authHeaders();
    resp = await fetch(`${BASE_URL}/notes/`, { headers });
  }

  if (!resp.ok) throw new Error('No se pudieron obtener las notas');
  return resp.json();
};

// 4. Registrar nuevo usuario
export const registerUser = async (userData) => {
  const resp = await fetch(`${BASE_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
    credentials: 'include',
  });
  if (!resp.ok) throw new Error('Error en registro');
  return resp.json();
};

// 5. Logout
export const logoutUser = async () => {
  const resp = await fetch(`${BASE_URL}/logout/`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
  });
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  return resp.ok;
};

// 6. Comprobar autenticación
export const checkAuthenticated = async () => {
  const resp = await fetch(`${BASE_URL}/authenticated/`, { headers: authHeaders() });
  if (!resp.ok) return false;
  const data = await resp.json();
  return data.isAuthenticated;
};
